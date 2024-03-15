import PropTypes from 'prop-types';

import styles from './button.module.css';

const Button = ({ type = 'button', children}) => {
    return (
        <button className={styles.button} type={type}>
            {children}
        </button>
    );
};

export default Button;

Button.propTypes = {
    type: PropTypes.string,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
    ]).isRequired,
};
