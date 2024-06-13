import styles from './FooterItem.module.css';

// định hình cấu trúc footer
const FooterItem = props => {
  return (
    <div className={styles.col}>
      {props.col_values.map(text => (
        <p key={text}>{text}</p>
      ))}
    </div>
  );
};

export default FooterItem;
