// Role management utilities
export const ROLES = {
    ADMIN: 'admin',
    FARMER: 'farmer'
};

// Admin email list - can be expanded
export const ADMIN_EMAILS = [
    'admin@greencoders.com'
];

// Check if user is admin
export const isAdmin = (email) => {
    return ADMIN_EMAILS.includes(email?.toLowerCase());
};

// Generate unique farmer ID
export const generateFarmerId = () => {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    return `FC-${year}-${random}`;
};

// Check user role
export const getUserRole = (email) => {
    return isAdmin(email) ? ROLES.ADMIN : ROLES.FARMER;
};

// Permission checks
export const canEditCard = (userRole, cardOwnerId, userId) => {
    return userRole === ROLES.ADMIN || cardOwnerId === userId;
};

export const canDeleteCard = (userRole) => {
    return userRole === ROLES.ADMIN;
};

export const canAddFarmer = (userRole) => {
    return userRole === ROLES.ADMIN;
};

export const canAddAdmin = (userRole) => {
    return userRole === ROLES.ADMIN;
};
