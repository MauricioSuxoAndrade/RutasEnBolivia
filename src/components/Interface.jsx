import { Button, IconButton, Typography, Snackbar, Alert, CircularProgress, Fade, Tooltip, Drawer, MenuItem, Select, InputLabel, FormControl, Menu, Backdrop, Stepper, Step, StepLabel } from "@mui/material";
import { MuiColorInput } from "mui-color-input";
import { PlayArrow, Settings, Movie, Pause, Replay } from "@mui/icons-material";
import Slider from "./Slider";
import { useState, useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import { INITIAL_COLORS, LOCATIONS } from "../config";
import { arrayToRgb, rgbToArray } from "../helpers";

const Interface = forwardRef(({ canStart, started, animationEnded, playbackOn, time, maxTime, settings, colors, loading, timeChanged, cinematic, placeEnd, changeRadius, changeAlgorithm, setPlaceEnd, setCinematic, setSettings, setColors, startPathfinding, toggleAnimation, clearPath, changeLocation }, ref) => {
    const [sidebar, setSidebar] = useState(false);
    const [snack, setSnack] = useState({
        open: false,
        message: "",
        type: "error",
    });
    const [showTutorial, setShowTutorial] = useState(false);
    const [activeStep, setActiveStep] = useState(0);
    const [helper, setHelper] = useState(false);
    const [menuAnchor, setMenuAnchor] = useState(null);
    const menuOpen = Boolean(menuAnchor);
    const helperTime = useRef(4800);
    const rightDown = useRef(false);
    const leftDown = useRef(false);

    // Expose showSnack to parent from ref
    useImperativeHandle(ref, () => ({
        showSnack(message, type = "error") {
            setSnack({ open: true, message, type });
        },
    }));
      
    function closeSnack() {
        setSnack({...snack, open: false});
    }

    function closeHelper() {
        setHelper(false);
    }

    function handleTutorialChange(direction) {
        if(activeStep >= 2 && direction > 0) {
            setShowTutorial(false);
            return;
        }
        
        setActiveStep(Math.max(activeStep + direction, 0));
    }

    // Start pathfinding or toggle playback
    function handlePlay() {
        if(!canStart) return;
        if(!started && time === 0) {
            startPathfinding();
            return;
        }
        toggleAnimation();
    }
    
    function closeMenu() {
        setMenuAnchor(null);
    }

    window.onkeydown = e => {
        if(e.code === "ArrowRight" && !rightDown.current && !leftDown.current && (!started || animationEnded)) {
            rightDown.current = true;
            toggleAnimation(false, 1);
        }
        else if(e.code === "ArrowLeft" && !leftDown.current && !rightDown.current && animationEnded) {
            leftDown.current = true;
            toggleAnimation(false, -1);
        }
    };

    window.onkeyup = e => {
        if(e.code === "Escape") setCinematic(false);
        else if(e.code === "Space") {
            e.preventDefault();
            handlePlay();
        }
        else if(e.code === "ArrowRight" && rightDown.current) {
            rightDown.current = false;
            toggleAnimation(false, 1);
        }
        else if(e.code === "ArrowLeft" && animationEnded && leftDown.current) {
            leftDown.current = false;
            toggleAnimation(false, 1);
        }
        else if(e.code === "KeyR" && (animationEnded || !started)) clearPath();
    };

    // Show cinematic mode helper
    useEffect(() => {
        if(!cinematic) return;
        setHelper(true);
        setTimeout(() => {
            helperTime.current = 2500;
        }, 200);
    }, [cinematic]);

    useEffect(() => {
        if(localStorage.getItem("path_sawtutorial")) return;
        setShowTutorial(true);
        localStorage.setItem("path_sawtutorial", true);
    }, []);

    return (
        <>
            <div className={`nav-top ${cinematic ? "cinematic" : ""}`}>
                <div className="side slider-container">
                    <Typography id="playback-slider" gutterBottom>
                        Animacion
                    </Typography>
                    <Slider disabled={!animationEnded}  value={animationEnded ? time : maxTime} min={animationEnded ? 0 : -1} max={maxTime} onChange={(e) => {timeChanged(Number(e.target.value));}} className="slider" aria-labelledby="playback-slider" />
                </div>
                <IconButton disabled={!canStart} onClick={handlePlay} style={{ backgroundColor: "#46B780", width: 60, height: 60 }} size="large">
                    {(!started || animationEnded && !playbackOn) 
                        ? <PlayArrow style={{ color: "#fff", width: 26, height: 26 }} fontSize="inherit" />
                        : <Pause style={{ color: "#fff", width: 26, height: 26 }} fontSize="inherit" />
                    }
                </IconButton>
                <div className="side">
                    <Button disabled={!animationEnded && started} onClick={clearPath} style={{ color: "#fff", backgroundColor: "#404156", paddingInline: 30, paddingBlock: 7 }} variant="contained">Limpiar</Button>
                </div>
            </div>

            <div className={`nav-right ${cinematic ? "cinematic" : ""}`}>
                <Tooltip title="Open settings">
                    <IconButton onClick={() => {setSidebar(true);}} style={{ backgroundColor: "#2A2B37", width: 36, height: 36 }} size="large">
                        <Settings style={{ color: "#fff", width: 24, height: 24 }} fontSize="inherit" />
                    </IconButton>
                </Tooltip>
                
            </div>

            <div className="loader-container">
                <Fade
                    in={loading}
                    style={{
                        transitionDelay: loading ? "50ms" : "0ms",
                    }}
                    unmountOnExit
                >
                    <CircularProgress color="inherit" />
                </Fade>
            </div>

            <Snackbar 
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }} 
                open={snack.open} 
                autoHideDuration={4000} 
                onClose={closeSnack}>
                <Alert 
                    onClose={closeSnack} 
                    severity={snack.type} 
                    style={{ width: "100%", color: "#fff" }}
                >
                    {snack.message}
                </Alert>
            </Snackbar>

            <Snackbar 
                anchorOrigin={{ vertical: "top", horizontal: "center" }} 
                open={helper} 
                autoHideDuration={helperTime.current} 
                onClose={closeHelper}
            >
                <div className="cinematic-alert">
                    <Typography fontSize="18px"><b>Cinematic mode</b></Typography>
                    <Typography>Use keyboard shortcuts to control animation</Typography>
                    <Typography>Press <b>Escape</b> to exit</Typography>
                </div>
            </Snackbar>

            <div className="mobile-controls">
                <Button onClick={() => {setPlaceEnd(!placeEnd);}} style={{ color: "#fff", backgroundColor: "#404156", paddingInline: 30, paddingBlock: 7 }} variant="contained">
                    {placeEnd ? "Cambiar a nodo inicial" : "Cambiar a nodo final"}
                </Button>
            </div>


            <Drawer
                className={`side-drawer ${cinematic ? "cinematic" : ""}`}
                anchor="left"
                open={sidebar}
                onClose={() => {setSidebar(false);}}
            >
                <div className="sidebar-container">

                    <FormControl variant="filled">
                        <InputLabel style={{ fontSize: 14 }} id="algo-select">Algoritmo</InputLabel>
                        <Select
                            labelId="algo-select"
                            value={settings.algorithm}
                            onChange={e => {changeAlgorithm(e.target.value);}}
                            required
                            style={{ backgroundColor: "#404156", color: "#fff", width: "100%", paddingLeft: 1 }}
                            inputProps={{MenuProps: {MenuListProps: {sx: {backgroundColor: "#404156"}}}}}
                            size="small"
                            disabled={!animationEnded && started}
                        >
                            <MenuItem value={"astar"}>A *</MenuItem>
                            <MenuItem value={"greedy"}>Greedy</MenuItem>
                            <MenuItem value={"dijkstra"}>Dijkstra</MenuItem>
                            <MenuItem value={"bidirectional"}>Busqueda bidireccional</MenuItem>
                        </Select>
                    </FormControl>

                    <div>
                        <Button
                            id="locations-button"
                            aria-controls={menuOpen ? "locations-menu" : undefined}
                            aria-haspopup="true"
                            aria-expanded={menuOpen ? "true" : undefined}
                            onClick={(e) => {setMenuAnchor(e.currentTarget);}}
                            variant="contained"
                            disableElevation
                            style={{ backgroundColor: "#404156", color: "#fff", textTransform: "none", fontSize: 16, paddingBlock: 8, justifyContent: "start" }}
                        >
                            Localizaciones
                        </Button>
                        <Menu
                            id="locations-menu"
                            anchorEl={menuAnchor}
                            open={menuOpen}
                            onClose={() => {setMenuAnchor(null);}}
                            MenuListProps={{
                                "aria-labelledby": "locations-button",
                                sx: {
                                    backgroundColor: "#404156"
                                }
                            }}
                            anchorOrigin={{
                                vertical: "top",
                                horizontal: "right",
                            }}
                        >
                            {LOCATIONS.map(location => 
                                <MenuItem key={location.name} onClick={() => {
                                    closeMenu();
                                    changeLocation(location);
                                }}>{location.name}</MenuItem>
                            )}
                        </Menu>
                    </div>

                    <div className="side slider-container">
                        <Typography id="area-slider" >
                            Radio del Area: {settings.radius}km ({(settings.radius / 1.609).toFixed(1)}mi)
                        </Typography>
                        <Slider disabled={started && !animationEnded} min={2} max={20} step={1} value={settings.radius} onChangeCommited={() => { changeRadius(settings.radius); }} onChange={e => { setSettings({...settings, radius: Number(e.target.value)}); }} className="slider" aria-labelledby="area-slider" style={{ marginBottom: 1 }} 
                            marks={[
                                {
                                    value: 2,
                                    label: "2km"
                                },
                                {
                                    value: 20,
                                    label: "20km"
                                }
                            ]} 
                        />
                    </div>

                    <div className="side slider-container">
                        <Typography id="speed-slider" >
                            Velocidad de animacion
                        </Typography>
                        <Slider min={1} max={30} value={settings.speed} onChange={e => { setSettings({...settings, speed: Number(e.target.value)}); }} className="slider" aria-labelledby="speed-slider" style={{ marginBottom: 1 }} />
                    </div>

                    <div className="styles-container">
                        <Typography style={{ color: "#A8AFB3", textTransform: "uppercase", fontSize: 14 }} >
                            Styles
                        </Typography>
                        
                        <div>
                            <Typography id="start-fill-label" >
                                Nodo inicial
                            </Typography>
                            <div className="color-container">
                                <MuiColorInput value={arrayToRgb(colors.startNodeFill)} onChange={v => {setColors({...colors, startNodeFill: rgbToArray(v)});}} aria-labelledby="start-fill-label" style={{ backgroundColor: "#404156" }} />
                                <IconButton onClick={() => {setColors({...colors, startNodeFill: INITIAL_COLORS.startNodeFill});}} style={{ backgroundColor: "transparent" }} size="small">
                                    <Replay style={{ color: "#fff", width: 20, height: 20 }} fontSize="inherit" />
                                </IconButton>
                            </div>
                        </div>

                        <div>
                            <Typography id="start-border-label" >
                                Borde del nodo inicial
                            </Typography>
                            <div className="color-container">
                                <MuiColorInput value={arrayToRgb(colors.startNodeBorder)} onChange={v => {setColors({...colors, startNodeBorder: rgbToArray(v)});}} aria-labelledby="start-border-label" style={{ backgroundColor: "#404156" }} />
                                <IconButton onClick={() => {setColors({...colors, startNodeBorder: INITIAL_COLORS.startNodeBorder});}} style={{ backgroundColor: "transparent" }} size="small">
                                    <Replay style={{ color: "#fff", width: 20, height: 20 }} fontSize="inherit" />
                                </IconButton>
                            </div>
                        </div>

                        <div>
                            <Typography id="end-fill-label" >
                                Nodo final
                            </Typography>
                            <div className="color-container">
                                <MuiColorInput value={arrayToRgb(colors.endNodeFill)} onChange={v => {setColors({...colors, endNodeFill: rgbToArray(v)});}} aria-labelledby="end-fill-label" style={{ backgroundColor: "#404156" }} />
                                <IconButton onClick={() => {setColors({...colors, endNodeFill: INITIAL_COLORS.endNodeFill});}} style={{ backgroundColor: "transparent" }} size="small">
                                    <Replay style={{ color: "#fff", width: 20, height: 20 }} fontSize="inherit" />
                                </IconButton>
                            </div>
                        </div>

                        <div>
                            <Typography id="end-border-label" >
                                Borde del nodo final
                            </Typography>
                            <div className="color-container">
                                <MuiColorInput value={arrayToRgb(colors.endNodeBorder)} onChange={v => {setColors({...colors, endNodeBorder: rgbToArray(v)});}} aria-labelledby="end-border-label" style={{ backgroundColor: "#404156" }} />
                                <IconButton onClick={() => {setColors({...colors, endNodeBorder: INITIAL_COLORS.endNodeBorder});}} style={{ backgroundColor: "transparent" }} size="small">
                                    <Replay style={{ color: "#fff", width: 20, height: 20 }} fontSize="inherit" />
                                </IconButton>
                            </div>
                        </div>

                        <div>
                            <Typography id="path-label" >
                                Rutas
                            </Typography>
                            <div className="color-container">
                                <MuiColorInput value={arrayToRgb(colors.path)} onChange={v => {setColors({...colors, path: rgbToArray(v)});}} aria-labelledby="path-label" style={{ backgroundColor: "#404156" }} />
                                <IconButton onClick={() => {setColors({...colors, path: INITIAL_COLORS.path});}} style={{ backgroundColor: "transparent" }} size="small">
                                    <Replay style={{ color: "#fff", width: 20, height: 20 }} fontSize="inherit" />
                                </IconButton>
                            </div>
                        </div>

                        <div>
                            <Typography id="route-label" >
                                Ruta mas corta
                            </Typography>
                            <div className="color-container">
                                <MuiColorInput value={arrayToRgb(colors.route)} onChange={v => {setColors({...colors, route: rgbToArray(v)});}} aria-labelledby="route-label" style={{ backgroundColor: "#404156" }} />
                                <IconButton onClick={() => {setColors({...colors, route: INITIAL_COLORS.route});}} style={{ backgroundColor: "transparent" }} size="small">
                                    <Replay style={{ color: "#fff", width: 20, height: 20 }} fontSize="inherit" />
                                </IconButton>
                            </div>
                        </div>
                    </div>

                    <div className="shortcuts-container">
                        <Typography style={{ color: "#A8AFB3", textTransform: "uppercase", fontSize: 14 }} >
                            Atajos
                        </Typography>

                        <div className="shortcut">
                            <p>Espacio</p>
                            <p>Iniciar/Parar animacion</p>
                        </div>
                        <div className="shortcut">
                            <p>R</p>
                            <p>Limpiar</p>
                        </div>
                        <div className="shortcut">
                            <p>Flechas</p>
                            <p>Animacion</p>
                        </div>
                    </div>
                </div>
            </Drawer>

            
        </>
    );
});

Interface.displayName = "Interface";

export default Interface;
