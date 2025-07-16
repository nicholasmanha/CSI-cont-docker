export const getDefaultCameraUrl = () => {

    //ws.current = new WebSocket('ws://localhost:8000/pvws/pv');
    //ws.current = new WebSocket('ws://localhost/api/camera');

    const currentWebsiteIP = window.location.hostname;
    const currentWebsitePort = window.location.port;
    const pathname = "/pvcamera";
    var wsUrl;

    try {
        if (import.meta.env.REACT_APP_CAMERA_URL) {
            wsUrl = import.meta.env.REACT_APP_CAMERA_URL; //custom
        } else {
            wsUrl=`ws://${currentWebsiteIP}:${currentWebsitePort}/api/camera` //default reverse proxy
        }
    } catch (e) {
        console.error("Error getting default camera URL: ", e);
        return 'ws://localhost:8000/api/camera'; //fallback
    }

    return wsUrl;
};
