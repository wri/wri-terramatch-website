const USER_ROLES = {
  admin: 'admin',
  user: 'user'
};

const isAdmin = user => user.role === USER_ROLES.admin;

const hasOrganisation = user => (user.organisation_id !== null && user.organisation_id !== undefined);

const getUsersName = (user) => {
  return user.first_name && user.last_name ?
       `${user.first_name} ${user.last_name}` :
       user.email_address
};

const getUserInitials = (user) => {
  return user.first_name && user.last_name ? `${user.first_name[0]}${user.last_name[0]}`
    : `${user.email_address.split('@')[0][0]}${user.email_address.split('@')[1][0]}`;
};

const getUserKey = (user) => user.id ? `${user.id}-${user.type}` : user.email_address;


export { isAdmin, hasOrganisation, getUsersName, getUserInitials, getUserKey, USER_ROLES };
