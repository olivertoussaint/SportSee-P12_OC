import React, { useState, useEffect } from 'react';
import styles from './DataSource.module.css';
import PropTypes from 'prop-types';

function DataSource(props) {

  const [opacity, setOpacity] = useState(0); // Initialement défini à 0 (complètement transparent)

  useEffect(() => {
    const timer = setTimeout(() => {
      setOpacity(1); 
    }, 750);

    return () => clearTimeout(timer); 
  }, []); 

  return (
    <div className={styles.container} style={{ opacity: opacity, transition: 'opacity 0.5s ease-in' }}>
      <span className={styles.dataSign}>running with : </span>
      <span className={styles.dataSource}>{props.source}</span>
    </div>
  );
}

DataSource.propTypes = {
  source: PropTypes.string.isRequired,
};

export default DataSource;
