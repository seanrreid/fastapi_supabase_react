import PropTypes from 'prop-types';
import styles from './list.module.css';
export default function LinkList({ linkList }) {
    // const src_url = import.meta.env.VITE_SOURCE_URL;
    const src_url = 'http://localhost:8000';
    return (
        <ul className={styles.list}>
            {linkList.map((link, id) => {
                return (
                    <li key={id}>
                        <a
                            href={`${src_url}/sendit?url=${link.short_url}`}
                            title={`Short link to ${link.title}`}
                            target="_blank"
                            rel="noreferrer"
                        >
                            {link.title}
                        </a>
                    </li>
                );
            })}
        </ul>
    );
}

LinkList.propTypes = {
    linkList: PropTypes.array
};
