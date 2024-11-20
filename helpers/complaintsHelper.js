const priorities = {
    'school':10,
    'hospital':10,
    'chemistShop':10,
    'parks':8,
    'religiousPlaces':8,
    'missedPickups':5,
    'gatherings':5,
}

const calculatePriority = (type) => {
    let priority = 1;
    priority+=priorities[type] || 0;
    return priority;
};

module.exports = { calculatePriority };