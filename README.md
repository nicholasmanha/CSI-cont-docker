# CSI Controller Docker
A containerized version of the CSI Controller for demoing purposes.  
This container contains EPICS base, Synapps, Ophyd Websocket and the Finch frontend. 

# Prereqs
`docker`  
`docker-compose`  

## Quick Start

```bash
git clone https://github.com/nicholasmanha/CSI-cont-docker.git
cd CSI-cont-docker
docker-compose up
```

# Info
Click on local url to view frontend `http://localhost:5173/`  
frontend runs on port 5173, ophyd on 8000 & EPICS on 5064 (server) and 5065 (repeater)  
This application runs an ADSim IOC configured with P=13SIM1
