import styles from './Content.module.css';

const Content = props => {
  // style của nút chung + style của nút riêng
  const classes = `${styles.content} ${props.className}`;

  return (
    <div
      type={props.type}
      className={classes}
      onClick={props.onClick}
      onChange={props.onChange}>
      {props.children}
    </div>
  );
};
export default Content;
