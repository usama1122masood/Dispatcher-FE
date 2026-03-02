import Icon from "@ant-design/icons"

const SignalSvg = () => (
    <svg viewBox="0 0 16 16"
        fill="currentColor" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin"><path d='M1 10a1 1 0 0 1 1 1v2a1 1 0 0 1-2 0v-2a1 1 0 0 1 1-1zm4-4a1 1 0 0 1 1 1v6a1 1 0 0 1-2 0V7a1 1 0 0 1 1-1zm4-4a1 1 0 0 1 1 1v10a1 1 0 0 1-2 0V3a1 1 0 0 1 1-1zm4-2a1 1 0 0 1 1 1v12a1 1 0 0 1-2 0V1a1 1 0 0 1 1-1z' /></svg>
)

const SignalIcon = (props: any) => (
    <Icon component={SignalSvg} {...props} />
)

export default SignalIcon;