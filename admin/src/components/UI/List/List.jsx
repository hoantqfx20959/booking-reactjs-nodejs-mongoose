import styles from './List.module.css';

const List = props => {
  // style của khung chung + style của khung riêng
  const classes = `${styles.list} ${props.className}`;

  return (
    <div className={classes} style={props.style}>
      {props.children}
    </div>
  );
};

export default List;
