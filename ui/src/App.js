import React, { Suspense, useState } from "react";
import "./App.css";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { ModelF } from "./F";
import { ModelM } from "./M";
import "antd/dist/antd.css";
import {
    Col,
    Row,
    Layout,
    Typography,
    Switch,
    Input,
    Comment,
    List,
    Tooltip,
    Skeleton,
    Spin,
    notification,
} from "antd";
import {
    PaperClipOutlined,
    GithubOutlined,
    ReloadOutlined,
    InfoCircleOutlined,
} from "@ant-design/icons";
const { Header, Content } = Layout;
const { Title } = Typography;

const data = [
    {
        author: "Han Solo",
        content: <p>I’m struck with life, Help me.</p>,
    },
    {
        author: "Derek Zoolander",
    },
];

const DemoBox = (props) => (
    <p style={{ height: "600px" }} className={`height-${props.value}`}>
        {props.children}
    </p>
);

export default function App() {
    const [modelState, setModelState] = useState("M");
    const [on, setOn] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingComment, setLoadingComment] = useState(false);
    const [updatedResponse, setUpdatedResponse] = useState("");
    const response =
        "You are a loser. Get a life. Every deal with their own problems dude.";

    const runModel = async () => {
        setLoadingComment(true);
        try {
            const res = await fetch("http://localhost:9000/runModel", {
                method: "POST",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    seeker: data[0].content.props.children,
                    response: response,
                    return_original: false,
                }),
            });
            if (res.ok) {
                const data = await res.json();
                setUpdatedResponse(data.output);
            }
            setLoadingComment(false);
            setLoading(false);
        } catch (e) {
            openNotification(e);
            setLoadingComment(false);
            setLoading(false);
        }
    };

    const openNotification = (e) => {
        notification['error']({
            message: e.message,
            description:
                'Something went wrong. Please try again.',
            className: 'custom-class',
            style: {
                width: 250,
            },
        });
    }

    const onChange = (checked) => {
        setOn(checked);
        setLoading(true);
        runModel();
    };
    const LayoutFor3D = (
        <Layout className="layout">
            <Header className="header" style={{ backgroundColor: "white" }}>
                {/* put two text on the left side and center title and one button on the right */}
                <Row align="middle" className="header-row">
                    <Col flex={0.25}>
                        {/* add the icon and title */}
                        <PaperClipOutlined style={{ fontSize: "15px" }} />
                        <Title level={4} style={{ display: "inline-block" }}>
                            Blog
                        </Title>
                    </Col>
                    <Col flex={0.25}>
                        {/* add the icon and title */}
                        <GithubOutlined style={{ fontSize: "15px", margin: "3px" }} />
                        <Title level={4} style={{ display: "inline-block" }}>
                            Github
                        </Title>
                    </Col>
                    <Col flex={4}>
                        <Title level={1} style={{ textAlign: "center" }}>
                            BayMax
                        </Title>
                    </Col>
                    <Col flex={1}>
                        <InfoCircleOutlined style={{ fontSize: "17px", margin: "3px" }} />
                        <Title level={4} style={{ display: "inline-block" }}>
                            About
                        </Title>
                    </Col>
                </Row>
            </Header>
            <Content className="content">
                <Row align="middle">
                    <Col span={18} push={6} style={{ padding: "0 35px" }}>
                        <DemoBox value={500}>Demo Chat</DemoBox>
                        <Input placeholder="Type your message" style={{ width: "100%" }} />
                    </Col>
                    <Col span={6} pull={18}>
                        <Row>
                            <Col flex={1.5}>
                                <Switch defaultChecked onChange={onChange} size="small" />
                            </Col>
                            <Col flex={2.5}>
                                <Canvas
                                    camera={{ position: [2, 0, 9.0], fov: 15 }}
                                    style={{
                                        width: "25vw",
                                        height: "90vh",
                                    }}
                                >
                                    <ambientLight intensity={1.25} />
                                    <ambientLight intensity={0.1} />
                                    <directionalLight intensity={0.4} />
                                    <Suspense fallback={null}>
                                        {modelState === "M" ? (
                                            <ModelM position={[0.025, -0.85, 0]} />
                                        ) : (
                                            <ModelF position={[0.025, -0.85, 0]} />
                                        )}
                                    </Suspense>
                                    <OrbitControls />
                                </Canvas>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Content>
            {/* <Footer>Footer</Footer> */}
        </Layout>
    );
    return (
        <div style={{ padding: "20px" }}>
            {loading ? (
                <Skeleton avatar style={{ padding: "20px" }} />
            ) : (
                <>
                    <Row justify="end">
                        <Col style={{ padding: "0px 10px" }}>Turn on the Model</Col>
                        <Col>
                            <Switch checked={on} onChange={onChange} size="small" />
                        </Col>
                    </Row>
                    <Comment author={data[0].author} content={data[0].content} />
                    {loadingComment ? (
                        <Spin size="large" />
                    ) : (
                        <>
                            <List
                                className="comment-list"
                                itemLayout="horizontal"
                                dataSource={[data[1]]}
                                renderItem={(item) => (
                                    <li>
                                        <Comment
                                            actions={
                                                on
                                                    ? [
                                                        <Tooltip key="comment-basic-like" title="Like">
                                                            <span onClick={runModel}>
                                                                {/* add a refresh icon */}
                                                                <ReloadOutlined style={{ padding: "5px" }} />
                                                                <span className="comment-action">
                                                                    Refresh
                                                                </span>
                                                            </span>
                                                        </Tooltip>,
                                                    ]
                                                    : []
                                            }
                                            author={item.author}
                                            avatar={item.avatar}
                                            content={
                                                on && updatedResponse ? updatedResponse : response
                                            }
                                            datetime={item.datetime}
                                        />
                                    </li>
                                )}
                            />
                        </>
                    )}
                </>
            )}
        </div>
    );
}
