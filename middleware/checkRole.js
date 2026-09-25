export function checkRole(...roles) {

  return (req, res, next) => {
    
    /// check current authed user
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        error: "invalid token",
      });
    }


    /// check user role
    const current_role = user.role;
    
    
    /// if role in roles -> next
    if (roles.includes(current_role)) {
      next()
    } else {
      /// else error
      return res.status(403).json({
        error: "forbidden"
      })
    }
    
  }

}