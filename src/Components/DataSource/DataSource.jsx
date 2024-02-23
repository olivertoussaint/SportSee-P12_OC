import React from 'react'
import styles from './DataSource.module.css'
import PropTypes from 'prop-types'

function DataSource(props) {
      return (
            <div className={styles.container}>
              <span className={styles.dataSign}>You are using data from :</span>
              <span className={styles.dataSource}> {props.source} </span>
            </div>
          );
        }
        
        DataSource.propTypes = {
          source: PropTypes.string.isRequired,
        }
export default DataSource