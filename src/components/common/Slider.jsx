import { useState, useCallback } from 'react';
import styles from './Slider.module.css';

export function Slider({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  label,
  showValue = true,
  formatValue = (v) => v,
  marks = [],
  disabled = false,
  className = ''
}) {
  const [isDragging, setIsDragging] = useState(false);
  
  const percentage = ((value - min) / (max - min)) * 100;

  const handleChange = useCallback((e) => {
    const newValue = parseFloat(e.target.value);
    onChange(newValue);
  }, [onChange]);

  return (
    <div className={`${styles.container} ${disabled ? styles.disabled : ''} ${className}`}>
      {(label || showValue) && (
        <div className={styles.header}>
          {label && <label className={styles.label}>{label}</label>}
          {showValue && (
            <span className={styles.value}>{formatValue(value)}</span>
          )}
        </div>
      )}
      
      <div className={styles.sliderWrapper}>
        <div className={styles.track}>
          <div 
            className={styles.fill}
            style={{ width: `${percentage}%` }}
          />
          <div 
            className={`${styles.thumb} ${isDragging ? styles.active : ''}`}
            style={{ left: `${percentage}%` }}
          />
        </div>
        
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onTouchStart={() => setIsDragging(true)}
          onTouchEnd={() => setIsDragging(false)}
          disabled={disabled}
          className={styles.input}
        />
      </div>
      
      {marks.length > 0 && (
        <div className={styles.marks}>
          {marks.map((mark, index) => (
            <span 
              key={index} 
              className={styles.mark}
              style={{ left: `${((mark.value - min) / (max - min)) * 100}%` }}
            >
              {mark.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default Slider;
