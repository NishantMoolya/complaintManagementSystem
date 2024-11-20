const { calculatePriority } = require("../helpers/complaintsHelper");

const complaints = [];
const resolvedStack = [];

const registerComplaint = async (req, res) => {
    try {
        const { citizenName, contact, address, issue } = req.body;
        const priority = calculatePriority(address);

        const complaint = {
            id: complaints.length + 1,
            citizenName,
            contact,
            address,
            issue,
            priority,
            status: 'Pending',
            createdAt: new Date(),
        };

        complaints.push(complaint);
        res.status(201).json({ msg: 'complaint registered!', data: complaint, error: null });
    } catch (err) {
        console.log('an error occurred in server', err);
        res.status(500).json({ data: null, error: null, msg: 'an error in server cannot register complaints' });
    }
};

const getComplaints = async (req, res) => {
    try {
        const sortedComplaints = complaints.sort((a, b) => b.priority - a.priority);
        res.status(200).json({ msg: 'complaints', data: sortedComplaints, error: null });
    } catch (err) {
        console.log('an error occurred in server', err);
        res.status(500).json({ data: null, error: null, msg: 'an error in server cannot get complaints list' });
    }
};

const resolveParticularComplaint = async (req, res) => {
    try {
        const { id } = req.params;
        // const complaint = complaints.find((c) => c.id == id);
        const index = complaints.findIndex((c) => c.id == id);
        const complaint = complaints[index];

        if (!complaint) {
            return res.status(404).json({ data: null, error: 'complaint not found', message: 'complaint not found!' });
        }

        if (complaint.status === 'Resolved') {
            return res.status(400).json({ data: null, error: 'complaint already resolved', message: 'complaint is already resolved!' });
        }

        complaint.status = 'Resolved';
        complaint.resolvedAt = new Date();
        resolvedStack.push({ ...complaint }); // Push to stack for history
        
        const removeComplaint = complaints.splice(index, 1)[0];

        res.status(200).json({ msg: 'complaint resolved!', data: complaint, error: null });
    } catch (err) {
        console.log('an error occurred in server', err);
        res.status(500).json({ data: null, error: null, msg: 'an error in server cannot resolve complaint' });
    }
};

const resolveComplaint = async (req, res) => {
    try {
        const complaint = complaints.shift();

        if (!complaint) {
            return res.status(404).json({ data: null, error: 'complaint not found', message: 'complaint not found!' });
        }

        complaint.status = 'Resolved';
        complaint.resolvedAt = new Date();
        resolvedStack.push({ ...complaint }); // Push to stack for history

        res.status(200).json({ msg: 'complaint resolved!', data: complaint, error: null });
    } catch (err) {
        console.log('an error occurred in server', err);
        res.status(500).json({ data: null, error: null, msg: 'an error in server cannot resolve complaint' });
    }
};

const revertComplaint = async (req, res) => {
    try {
        const { id } = req.params;
        const index = resolvedStack.findIndex((c) => c.id == id);

        if (index === -1) {
            return res.status(404).json({ data: null, error: 'resolved complaint not found', message: 'resolved complaint not found in history!' });
        }

        const revertedComplaint = resolvedStack.splice(index, 1)[0];
        revertedComplaint.status = 'Pending';
        delete revertedComplaint.resolvedAt;

        complaints.push(revertedComplaint);

        res.status(200).json({ msg: 'complaint resolution reverted!', data: revertedComplaint, error: null });
    } catch (err) {
        console.log('an error occurred in server', err);
        res.status(500).json({ data: null, error: null, msg: 'an error in server cannot revert complaint' });
    }
};

const generateDailyLog = async (req, res) => {
    try {
        const resolvedToday = resolvedStack.filter((c) => {
            const resolvedDate = new Date(c.resolvedAt).toDateString();
            const today = new Date().toDateString();
            return resolvedDate === today;
        });
    
        const csvContent = [
            ['ID', 'Citizen Name', 'Issue', 'Resolved At'].join(','),
            ...resolvedToday.map((c) =>
                [c.id, c.citizenName, c.issue, c.resolvedAt].join(',')
            )
        ].join('\n');
    
        res.header('Content-Type', 'text/csv');
        res.attachment('daily_resolved_logs.csv');
        res.status(200);
        res.send(csvContent);
        // res.status(200).json({ msg: 'daily log file sent', data: null, error: null });
    } catch (err) {
        console.log('an error occurred in server', err);
        res.status(500).json({ data: null, error: null, msg: 'an error in server cannot geting daily log' });
    }
};

module.exports = { registerComplaint, getComplaints, resolveComplaint, resolveParticularComplaint, revertComplaint, generateDailyLog };