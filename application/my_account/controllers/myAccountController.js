const PDFKit = require('pdfkit');

const Medication = require('../../diary/models/Medication');
const Symptom = require('../../diary/models/Symptom');
const PharmacyMedication = require('../../dashboard/models/PharmacyMedication');
const User = require('../../authentication/models/classes/User'); 

const getHistory = async (user) => {
    const email = user.email;

    const allSymptoms = await Symptom.getRecords(email);
    const allMedications = await Medication.getRecords(email);
    const allPharmacyMedications = await PharmacyMedication.getRecords(email);

    console.log('All Symptoms:', allSymptoms);
    console.log('All Medications:', allMedications);
    console.log('All Pharmacy Medications:', allPharmacyMedications);
    
    const userHistory = [];

    const sortedData = [...allSymptoms, ...allMedications, ...allPharmacyMedications].sort((a, b) => a.date - b.date);

    let latestDate = new Date(0);
    sortedData.forEach((entry) => {
        
        if (latestDate < entry.date) {
            userHistory.push(`Date: ${entry.date.toDateString()}`);
            latestDate = entry.date;
        }
        
        if (entry instanceof Symptom) {
            let severity = '';
            switch (entry.severity) {
                case '1':
                    severity = 'Mild';
                    break;
                case '2':
                    severity = 'Moderate';
                    break;
                case '3':
                    severity = 'Severe';
                    break;
                default:
                    severity = 'Unknown';
            }
            userHistory.push(`${severity} ${entry.name}`);
        } else if (entry instanceof Medication) {
            userHistory.push(`${entry.name} (${entry.quantity}x)`); 
        } else if (entry instanceof PharmacyMedication) {
            userHistory.push(`${entry.displayName}`);
        }
    });

    console.log('User History:', userHistory);

    return userHistory;
}

const myAccount = async (req, res) => {
    try {
      if (req.user) {
        const user = await User.findById(req.user._id); 
        const userHistory = await getHistory(user);
        res.render('my_account', { user, userHistory }); 
      } else {
        res.redirect('/login'); 
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      res.status(500).send('Internal Server Error'); 
    }
  };

const exportHistory = async (req, res) => {
    try {
        if (req.user) {
            const user = await User.findById(req.user._id); 
            const history = await getHistory(user);
            const doc = new PDFKit();
            console.log('Date Now:', user);
            const dateNow = new Date().toISOString().replace(/-/g, '_').split('T')[0];
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=${user.username}_sneezl_history_${dateNow}.pdf`);
            doc.pipe(res);
            doc.fontSize(36);
            doc.text('Sneezl User History', { align: 'center' });
            doc.fontSize(12);
            doc.text(`Username: ${user.username}, Email: ${user.email}`, { align: 'center' });
            doc.text(`Export Date: ${new Date().toDateString()}`, { align: 'center' });
            doc.text(' ');
            // doc.fontSize(20);
            // doc.text('History (Oldest to Newest):');
            history.forEach((log, index) => {
                doc.fontSize(12);
                if (log.startsWith('Date:')) {
                    // doc.fontSize(16);
                    doc.text(' ');
                    doc.text(`${log}`);
                }
                else {
                    doc.text(`- ${log}`);
                }
            });
            doc.end();
        } else {
            res.redirect('/auth/login'); 
        }
    } catch (error) {
        console.error('Error exporting user history:', error);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = {
    myAccount,
    exportHistory
};