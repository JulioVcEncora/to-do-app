import { Col, Row } from 'antd';
import './styles/Metrics.styles.scss';

export const Metrics: React.FC = () => {
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
                <Col span={8}>Low: 10:25 mins</Col>
            </Row>
            <Row className='row'>
                <Col className='normal-task-time' span={8}>
                    22:15 minutes
                </Col>
                <Col span={8} />
                <Col span={8}>Medium: 10:25 mins</Col>
            </Row>
            <Row className='row'>
                <Col span={16} />
                <Col span={8}>High: 10:25 mins</Col>
            </Row>
        </div>
    );
};
