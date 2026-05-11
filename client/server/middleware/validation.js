// Validation middleware for various endpoints

// Date validation
export const validateDateRange = (req, res, next) => {
  const { start_date, end_date } = req.body;
  
  if (!start_date || !end_date) {
    return res.status(400).json({
      success: false,
      message: "Please provide both start_date and end_date",
    });
  }

  const startDate = new Date(start_date);
  const endDate = new Date(end_date);
  
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    return res.status(400).json({
      success: false,
      message: "Invalid date format",
    });
  }

  if (endDate <= startDate) {
    return res.status(400).json({
      success: false,
      message: "End date must be after start date",
    });
  }

  if (startDate < new Date().setHours(0,0,0,0)) {
    return res.status(400).json({
      success: false,
      message: "Start date cannot be in the past",
    });
  }

  next();
};

// Room booking validation
export const validateRoomBooking = (req, res, next) => {
  const { 
    room_id, 
    start_date, 
    end_date, 
    adults = 1, 
    children = 0 
  } = req.body;

  if (!room_id || !start_date || !end_date) {
    return res.status(400).json({
      success: false,
      message: "Please provide room_id, start_date, and end_date",
    });
  }

  if (adults < 1 || children < 0) {
    return res.status(400).json({
      success: false,
      message: "Adults must be at least 1 and children cannot be negative",
    });
  }

  const startDate = new Date(start_date);
  const endDate = new Date(end_date);
  
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    return res.status(400).json({
      success: false,
      message: "Invalid date format",
    });
  }

  if (endDate <= startDate) {
    return res.status(400).json({
      success: false,
      message: "Check-out date must be after check-in date",
    });
  }

  if (startDate < new Date().setHours(0,0,0,0)) {
    return res.status(400).json({
      success: false,
      message: "Start date cannot be in the past",
    });
  }

  req.validatedBooking = {
    room_id: parseInt(room_id),
    start_date,
    end_date,
    adults: parseInt(adults),
    children: parseInt(children),
    extra_bed: req.body.extra_bed === true || req.body.extra_bed === 1,
    meal_package_id: req.body.meal_package_id ? parseInt(req.body.meal_package_id) : null,
    notes: req.body.notes || null
  };

  next();
};

// Restaurant booking validation
export const validateRestaurantBooking = (req, res, next) => {
  const { 
    restaurant_id, 
    reservation_datetime, 
    party_size, 
    duration_minutes = 90 
  } = req.body;

  if (!restaurant_id || !reservation_datetime || !party_size) {
    return res.status(400).json({
      success: false,
      message: "Please provide restaurant_id, reservation_datetime, and party_size",
    });
  }

  const reservationDate = new Date(reservation_datetime);
  
  if (isNaN(reservationDate.getTime())) {
    return res.status(400).json({
      success: false,
      message: "Invalid reservation datetime format",
    });
  }

  if (reservationDate <= new Date()) {
    return res.status(400).json({
      success: false,
      message: "Reservation datetime must be in the future",
    });
  }

  if (party_size < 1) {
    return res.status(400).json({
      success: false,
      message: "Party size must be at least 1",
    });
  }

  if (duration_minutes < 15 || duration_minutes > 480) { // 15 min to 8 hours
    return res.status(400).json({
      success: false,
      message: "Duration must be between 15 and 480 minutes",
    });
  }

  req.validatedBooking = {
    restaurant_id: parseInt(restaurant_id),
    reservation_datetime,
    party_size: parseInt(party_size),
    duration_minutes: parseInt(duration_minutes),
    table_id: req.body.table_id ? parseInt(req.body.table_id) : null,
    special_requests: req.body.special_requests || null
  };

  next();
};

// Hall booking validation
export const validateHallBooking = (req, res, next) => {
  const { 
    hall_id, 
    event_date, 
    start_time, 
    end_time,
    guests_count = 0
  } = req.body;

  if (!hall_id || !event_date || !start_time || !end_time) {
    return res.status(400).json({
      success: false,
      message: "Please provide hall_id, event_date, start_time, and end_time",
    });
  }

  const eventDate = new Date(event_date);
  const startTime = new Date(`${event_date} ${start_time}`);
  const endTime = new Date(`${event_date} ${end_time}`);
  
  if (isNaN(eventDate.getTime()) || isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
    return res.status(400).json({
      success: false,
      message: "Invalid date or time format",
    });
  }

  if (eventDate < new Date().setHours(0,0,0,0)) {
    return res.status(400).json({
      success: false,
      message: "Event date cannot be in the past",
    });
  }

  if (endTime <= startTime) {
    return res.status(400).json({
      success: false,
      message: "End time must be after start time",
    });
  }

  if (guests_count < 0) {
    return res.status(400).json({
      success: false,
      message: "Guests count cannot be negative",
    });
  }

  req.validatedBooking = {
    hall_id: parseInt(hall_id),
    event_date,
    start_time,
    end_time,
    event_type: req.body.event_type || null,
    guests_count: parseInt(guests_count),
    special_requests: req.body.special_requests || null
  };

  next();
};

// Payment validation
export const validatePayment = (req, res, next) => {
  const { invoice_id, amount, method } = req.body;

  if (!invoice_id || !amount || !method) {
    return res.status(400).json({
      success: false,
      message: "Please provide invoice_id, amount, and method",
    });
  }

  const validMethods = ["VISA", "CASH", "MASTERCARD", "PAYPAL", "OTHER"];
  if (!validMethods.includes(method)) {
    return res.status(400).json({
      success: false,
      message: "Invalid payment method",
    });
  }

  if (amount <= 0) {
    return res.status(400).json({
      success: false,
      message: "Amount must be greater than 0",
    });
  }

  req.validatedPayment = {
    invoice_id: parseInt(invoice_id),
    amount: parseFloat(amount),
    method,
    transaction_ref: req.body.transaction_ref || null
  };

  next();
};

// Refund validation
export const validateRefund = (req, res, next) => {
  const { payment_id, amount } = req.body;

  if (!payment_id || !amount) {
    return res.status(400).json({
      success: false,
      message: "Please provide payment_id and amount",
    });
  }

  if (amount <= 0) {
    return res.status(400).json({
      success: false,
      message: "Refund amount must be greater than 0",
    });
  }

  req.validatedRefund = {
    payment_id: parseInt(payment_id),
    amount: parseFloat(amount),
    reason: req.body.reason || null,
    method: req.body.method || null
  };

  next();
};

// Employee creation validation
export const validateEmployeeCreation = (req, res, next) => {
  const { 
    first_name, 
    last_name, 
    email, 
    password,
    roles = ['employee']
  } = req.body;

  if (!first_name || !last_name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please provide all required fields: first_name, last_name, email, password",
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 6 characters long",
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: "Invalid email format",
    });
  }

  const validRoles = ["customer", "employee", "dept_manager", "admin", "owner"];
  const invalidRoles = roles.filter(role => !validRoles.includes(role));
  
  if (invalidRoles.length > 0) {
    return res.status(400).json({
      success: false,
      message: `Invalid roles: ${invalidRoles.join(", ")}`,
    });
  }

  req.validatedEmployee = {
    first_name: first_name.trim(),
    last_name: last_name.trim(),
    email: email.trim().toLowerCase(),
    password,
    phone_number: req.body.phone_number || null,
    department_id: req.body.department_id ? parseInt(req.body.department_id) : null,
    job_title: req.body.job_title || null,
    hire_date: req.body.hire_date || null,
    salary: req.body.salary ? parseFloat(req.body.salary) : null,
    roles
  };

  next();
};

// Room creation validation
export const validateRoomCreation = (req, res, next) => {
  const { room_number, room_type_id, floor } = req.body;

  if (!room_number || !room_type_id) {
    return res.status(400).json({
      success: false,
      message: "Please provide room_number and room_type_id",
    });
  }

  if (room_number.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: "Room number cannot be empty",
    });
  }

  req.validatedRoom = {
    room_number: room_number.trim(),
    room_type_id: parseInt(room_type_id),
    floor: floor ? parseInt(floor) : null,
    extra_bed_allowed: req.body.extra_bed_allowed === true || req.body.extra_bed_allowed === 1,
    extra_bed_price: req.body.extra_bed_price ? parseFloat(req.body.extra_bed_price) : 0,
    notes: req.body.notes || null,
    status: req.body.status || 'ACTIVE'
  };

  next();
};

// Generic ID validation
export const validateId = (paramName = 'id') => {
  return (req, res, next) => {
    const id = req.params[paramName];
    
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        message: `Invalid ${paramName}`,
      });
    }
    
    req.params[paramName] = parseInt(id);
    next();
  };
};

// Status validation
export const validateStatus = (validStatuses) => {
  return (req, res, next) => {
    const { status } = req.body;
    
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
      });
    }
    
    next();
  };
};
