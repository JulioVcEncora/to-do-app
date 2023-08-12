import { Col, Row } from 'antd';
import { fetchMetrics } from '../../features/todos';
import { useAppDispatch, useAppSelector } from '../../../app';
import './styles/Metrics.styles.scss';
import { useEffect } from 'react';
import moment from 'moment';

export const Metrics: React.FC = () => {
    const dispatch = useAppDispatch();
    const { loading, metrics } = useAppSelector((state) => state.metrics);

    useEffect(() => {
        dispatch(fetchMetrics());
    }, [dispatch]);

    if (!metrics || loading) {
        return <div>...loading</div>;
    }

    const durationGeneral = moment.duration(metrics.generalAverageTime);
    const lowTime = moment.duration(metrics.lowAverageTime);
    const mediumTime = moment.duration(metrics.mediumAverageTime);
    const highTime = moment.duration(metrics.highAverageTime);

    const generalTimeFormatted =
        durationGeneral.asSeconds() === 0
            ? '--:--'
            : `${Math.floor(durationGeneral.asMinutes())}:${
                  durationGeneral.seconds() / 10 < 1
                      ? `0${durationGeneral.seconds()}`
                      : durationGeneral.seconds()
              }`;
    const lowTimeFormatted =
        lowTime.asSeconds() === 0
            ? '--:--'
            : `${Math.floor(lowTime.asMinutes())}:${
                  lowTime.seconds() / 10 < 1
                      ? `0${lowTime.seconds()}`
                      : lowTime.seconds()
              }`;
    const highTimeFormatted =
        highTime.asSeconds() === 0
            ? '--:--'
            : `${Math.floor(highTime.asMinutes())}:${
                  highTime.seconds() / 10 < 1
                      ? `0${highTime.seconds()}`
                      : highTime.seconds()
              }`;
    const mediumTimeFormatted =
        mediumTime.asSeconds() === 0
            ? '--:--'
            : `${Math.floor(mediumTime.asMinutes())}:${
                  mediumTime.seconds() / 10 < 1
                      ? `0${mediumTime.seconds()}`
                      : mediumTime.seconds()
              }`;

    return (
        <div className='metrics-container'>
            <Row className='header row'>
                <Col className='finish-tasks' span={8}>
                    Average time to finish tasks:
                </Col>
                <Col span={8} />
                <Col span={8}>Average time to finish tasks by priority:</Col>
            </Row>
            <Row className='row'>
                <Col span={16} />
                <Col span={8}>Low: {lowTimeFormatted} mins</Col>
            </Row>
            <Row className='row'>
                <Col className='normal-task-time' span={8}>
                    {generalTimeFormatted} minutes
                </Col>
                <Col span={8} />
                <Col span={8}>Medium: {mediumTimeFormatted} mins</Col>
            </Row>
            <Row className='row'>
                <Col span={16} />
                <Col span={8}>High: {highTimeFormatted} mins</Col>
            </Row>
        </div>
    );
};
