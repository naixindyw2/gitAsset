var LODinterval : float = 0.5;
var highLod : Mesh;
var medLod : Mesh;
var lowLod : Mesh;
var MedDistance : float = 60.0;
var LowDistance : float = 80.0;
var RenderDistanceEnabled : boolean = true;
var RenderDistance : float = 200.0;
var InteriorObjects : GameObject[];
var ExteriorObjects : GameObject[];
var SoundTriggerEnabled : boolean = false;
var SoundManager : GameObject;
var SoundTrackID : int = 0;

private var SoundManagerScript;
private var OriginalSoundTrack : int = 0;
private var MedDistSQ : float;
private var LowDistSQ : float;
private var RenderDistSQ : float;
private var LODrunning : boolean = true;
yield setLOD();

function Start() {
	MedDistSQ = MedDistance * MedDistance;
	LowDistSQ = LowDistance * LowDistance;
	RenderDistSQ = RenderDistance * RenderDistance;
	triggerTime = Time.time;
	ActivateInteriorObjects(false);
	ActivateExteriorObjects(true);
	
	if (SoundTriggerEnabled){
		SoundManagerScript = SoundManager.GetComponent("SoundManager");
	}
}

function setLOD () {
	while (LODrunning) {
	
	yield WaitForSeconds (LODinterval);
    var campos = Camera.main.transform.position;
    var meshFilter : MeshFilter = GetComponent(MeshFilter);
	var objPos = transform.position;

    if( (objPos - campos).sqrMagnitude < MedDistSQ ) {
        // use high LOD
        if( meshFilter.sharedMesh != highLod )
            meshFilter.sharedMesh = highLod;
    } else {
		if( (objPos - campos).sqrMagnitude < LowDistSQ ) {
			GetComponent.<Renderer>().enabled = true;
			// use med LOD
	        if( meshFilter.sharedMesh != medLod )
	            meshFilter.sharedMesh = medLod;
		} else {
			if( (objPos - campos).sqrMagnitude < RenderDistSQ ) {
				GetComponent.<Renderer>().enabled = true;
				// use low LOD
		        if( meshFilter.sharedMesh != lowLod )
		            meshFilter.sharedMesh = lowLod;
			} else {
				// disable renderer
				if (RenderDistanceEnabled) {
					GetComponent.<Renderer>().enabled = false;
				}
			}
		}
	}
	
	}
}

var EnableCameraZoom : boolean = false;
var CameraZoomDistance : float = 1.3;
private var OriginalCameraZoomDistance : float = -5.3;

function Update() {	
}

function OnTriggerEnter (other : Collider) {
	if (other.tag == "Player") {
		if (SoundTriggerEnabled) {
			OriginalSoundTrack = SoundManagerScript.GetTrack();
			SoundManagerScript.SwitchTrack(SoundTrackID);
		}
		ActivateInteriorObjects(true);
		ActivateExteriorObjects(false);
		if (EnableCameraZoom) {
			Camera.main.transform.localPosition.z = -CameraZoomDistance;
		}
	}	
}

function OnTriggerExit (other : Collider) {
	if (other.tag == "Player") {
		if (SoundTriggerEnabled) {
			SoundManagerScript.SwitchTrack(OriginalSoundTrack);
		}
		ActivateInteriorObjects(false);
		ActivateExteriorObjects(true);
		if (EnableCameraZoom) {
			Camera.main.transform.localPosition.z = OriginalCameraZoomDistance;
		}
	}	
}

function ActivateInteriorObjects(state : boolean) {
	var x;
	var i = 0;
	for (x in InteriorObjects) {
		InteriorObjects[i].active = state;
		i++;
	}
}

function ActivateExteriorObjects(state : boolean) {
	var x;
	var i = 0;
	for (x in ExteriorObjects) {
		ExteriorObjects[i].active = state;
		i++;
	}
}

