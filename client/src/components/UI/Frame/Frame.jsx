import styles from './Frame.module.css';

const Frame = props => {
  // style của khung chung + style của khung riêng
  const classes = `${styles.frame} ${props.className}`;

  return (
    <div className={classes} style={props.style}>
      {props.children}
    </div>
  );
};

export default Frame;
