import PropTypes from 'prop-types';

import styles from './wrapper.module.css';

const Wrapper = ({ children }) => {
    return <div className={styles.wrapper}>{children}</div>;
};

export default Wrapper;

Wrapper.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
    ]).isRequired,
};
