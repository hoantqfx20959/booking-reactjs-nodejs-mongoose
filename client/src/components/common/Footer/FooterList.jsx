import styles from './FooterList.module.css';

import FooterItem from './FooterItem';

// định hình cấu trúc footer
const FooterList = ({ footerData }) => {
  return (
    <div className={styles.footer}>
      {/* lấy dữ liệu từ data */}
      {footerData.map(footer => (
        <FooterItem key={footer.col_number} col_values={footer.col_values} />
      ))}
    </div>
  );
};

export default FooterList;
