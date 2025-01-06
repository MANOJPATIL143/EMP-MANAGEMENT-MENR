module.exports = (role) => {
    return (req, res, next) => {
      // Log req.user to check if it is populated
    //   console.log(,req.user);
  
      if (!req.user || req.user.role !== role) {
        return res.status(403).json({ message: 'Access denied' });
      }
  
      next();
    };
  };
  