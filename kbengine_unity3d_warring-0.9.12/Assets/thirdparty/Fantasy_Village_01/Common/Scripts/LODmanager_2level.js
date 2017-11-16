var LODinterval : float = 0.5;
var highLod : Mesh;
var lowLod : Mesh;
var distance = 10.0;
var RenderDistanceEnabled : boolean = true;
var RenderDistance = 100.0;
private var LowDistSQ;
private var RenderDistSQ;

private var LODrunning : boolean = true;
yield setLOD();

function Start() {
	LowDistSQ = distance * distance;
	RenderDistSQ = RenderDistance * RenderDistance;
}

function setLOD () {
	
	while (LODrunning) {
	
	yield WaitForSeconds (LODinterval);
    var campos = Camera.main.transform.position;
    var meshFilter : MeshFilter = GetComponent(MeshFilter);
	var objPos = transform.position;
	var objPosSQ = (objPos - campos).sqrMagnitude;

    if( objPosSQ < LowDistSQ ) {
        // use high LOD
        if( meshFilter.sharedMesh != highLod )
            meshFilter.sharedMesh = highLod;
    }
    else {
		if( objPosSQ < RenderDistSQ ) {
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