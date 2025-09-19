import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle, Line, Text as SvgText, G } from 'react-native-svg';
import { useTheme } from '@/contexts/ThemeContext';

interface AnalogClockProps {
  time: Date;
}

const AnalogClock: React.FC<AnalogClockProps> = ({ time }) => {
  const { isDark } = useTheme();

  const size = 250;
  const center = size / 2;
  const radius = size / 2 - 20;

  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();
  const milliseconds = time.getMilliseconds();

  const secondAngle = (seconds * 6 + milliseconds * 0.006) - 90;
  const minuteAngle = (minutes * 6 + seconds * 0.1) - 90;
  const hourAngle = (hours * 30 + minutes * 0.5) - 90;

  const getCoordinates = (angle: number, length: number) => {
    const rad = (angle * Math.PI) / 180;
    return {
      x: center + length * Math.cos(rad),
      y: center + length * Math.sin(rad),
    };
  };

  const hourHand = getCoordinates(hourAngle, radius * 0.5);
  const minuteHand = getCoordinates(minuteAngle, radius * 0.7);
  const secondHand = getCoordinates(secondAngle, radius * 0.9);

  const clockColors = {
    face: isDark ? '#1C1C1E' : 'white',
    border: isDark ? '#38383A' : '#333',
    numbers: isDark ? '#FFFFFF' : '#333',
    hands: isDark ? '#FFFFFF' : '#333',
    ticks: isDark ? '#8E8E93' : '#666',
    secondHand: '#FF453A'
  };

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        <Circle
          cx={center}
          cy={center}
          r={radius}
          fill={clockColors.face}
          stroke={clockColors.border}
          strokeWidth="3"
        />
        
        {[...Array(12)].map((_, i) => {
          const angle = (i * 30) - 90;
          const start = getCoordinates(angle, radius - 15);
          const end = getCoordinates(angle, radius - 5);
          const numberPos = getCoordinates(angle, radius - 25);
          const hour = i === 0 ? 12 : i;
          
          return (
            <G key={i}>
              <Line
                x1={start.x}
                y1={start.y}
                x2={end.x}
                y2={end.y}
                stroke={clockColors.numbers}
                strokeWidth="2"
              />
              <SvgText
                x={numberPos.x}
                y={numberPos.y + 5}
                fontSize="16"
                fontWeight="bold"
                fill={clockColors.numbers}
                textAnchor="middle"
              >
                {hour}
              </SvgText>
            </G>
          );
        })}

        {[...Array(60)].map((_, i) => {
          if (i % 5 !== 0) {
            const angle = (i * 6) - 90;
            const start = getCoordinates(angle, radius - 8);
            const end = getCoordinates(angle, radius - 3);
            
            return (
              <Line
                key={`minute-${i}`}
                x1={start.x}
                y1={start.y}
                x2={end.x}
                y2={end.y}
                stroke={clockColors.ticks}
                strokeWidth="1"
              />
            );
          }
          return null;
        })}

        <Line
          x1={center}
          y1={center}
          x2={hourHand.x}
          y2={hourHand.y}
          stroke={clockColors.hands}
          strokeWidth="6"
          strokeLinecap="round"
        />

        <Line
          x1={center}
          y1={center}
          x2={minuteHand.x}
          y2={minuteHand.y}
          stroke={clockColors.hands}
          strokeWidth="4"
          strokeLinecap="round"
        />

        <Line
          x1={center}
          y1={center}
          x2={secondHand.x}
          y2={secondHand.y}
          stroke={clockColors.secondHand}
          strokeWidth="2"
          strokeLinecap="round"
        />

        <Circle
          cx={center}
          cy={center}
          r="8"
          fill={clockColors.hands}
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default AnalogClock;
