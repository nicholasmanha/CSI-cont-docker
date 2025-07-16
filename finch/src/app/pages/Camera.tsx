import CameraContainer from "@/components/Camera/CameraContainer";
export default function Camera() {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-3xl font-bold mb-4">Camera Page</h1>
            <p className="text-lg">This is the camera page.</p>
            <CameraContainer prefix="13SIM1" enableControlPanel={true} enableSettings={false} canvasSize="medium"/>
        </div>
    )
}