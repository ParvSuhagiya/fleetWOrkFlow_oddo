const getHealth = (req, res) => {
    res.status(200).json({
        success: true,
        message: "Backend server is healthy",
        data: {
            uptime: process.uptime(),
            timestamp: Date.now(),
        },
    });
};

module.exports = { getHealth };
