import React, { useState, useEffect, useCallback, useRef } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { IconButton, Dialog, DialogTitle, DialogContent, TextField, Button, DialogActions } from '@mui/material';
import { Settings, ArrowUpward, ArrowDownward, Edit, Delete, ColorLens, Add } from '@mui/icons-material';
import './Tierlist.css';

// Enable drag and drop in StrictMode
const StrictModeDroppable = ({ children, ...props }) => {
    const [enabled, setEnabled] = useState(false);
    useEffect(() => {
        const animation = requestAnimationFrame(() => setEnabled(true));
        return () => {
            cancelAnimationFrame(animation);
            setEnabled(false);
        };
    }, []);
    if (!enabled) {
        return null;
    }
    return <Droppable {...props}>{children}</Droppable>;
};

const initialRows = [
    { id: 'S', name: 'S Tier', color: '#FF7F7F' },
    { id: 'A', name: 'A Tier', color: '#FFBF7F' },
    { id: 'B', name: 'B Tier', color: '#FFDF7F' },
    { id: 'C', name: 'C Tier', color: '#FFFF7F' },
    { id: 'D', name: 'D Tier', color: '#7FFF7F' }
];

const activeMembers = [
    'abigail_rachel.jpg', 'adeline_wijaya.jpg', 'alya_amanda.jpg', 'amanda_sukma.jpg',
    'angelina_christy.jpg', 'anindya_ramadhani.jpg', 'Astrella_Virgiananda.jpg',
    'Aulia_Riza.jpg', 'aurellia.jpg', 'aurhel_alana.jpg', 'Bong_Aprilli.jpg',
    'catherina_vallencia.jpg', 'cathleen_nixie.jpg', 'celline_thefani.jpg',
    'chelsea_davina.jpg', 'cornelia_vanisa.jpg', 'cynthia_yaputera.jpg',
    'dena_natalia.jpg', 'desy_natalia.jpg', 'febriola_sinambela.jpg',
    'feni_fitriyanti.jpg', 'fiony_alveria.jpg', 'freya_jayawardana.jpg',
    'fritzy_rosmerian.jpg', 'gabriela_abigail.jpg', 'gendis_mayrannisa.jpg',
    'gita_sekar_andarini.jpg', 'grace_octaviani.jpg', 'greesella_adhalia.jpg',
    'Hagia_Sopia.jpg', 'helisma_putri.jpg', 'hillary_abigail.jpg',
    'Humaira_Ramadhani.jpg', 'indah_cahya.jpg', 'indira_seruni.jpg',
    'Jacqueline_Immanuela.jpg', 'jazzlyn_trisha.jpg', 'Jemima_Evodie.jpg',
    'jessica_chandra.jpg', 'jesslyn_elly.jpg', 'kathrina_irene.jpg',
    'lulu_salsabila.jpg', 'marsha_lenathea.jpg', 'michelle_alexandra.jpg',
    'michelle_levia.jpg', 'Mikaela_Kusjanto.jpg', 'mutiara_azzahra.jpg',
    'nayla_suji.jpg', 'nina_tutachia.jpg', 'Nur_Intan.jpg',
    'oline_manuel.jpg', 'raisha_syifa.jpg', 'regina_wilian.jpg',
    'ribka_budiman.jpg', 'shabilqis_naila.jpg', 'shania_gracia.jpg',
    'victoria_kimberly.jpg'
];

const exMembers = [
    'abieza_syabira.webp', 'adhisty_zara.webp', 'adriani_elisabeth.webp',
    'adzana_shaliha.webp', 'aiko_harumi.webp', 'aisa_maharani.webp',
    'aki_takajo.jpg', 'alia_giselle.jpg', 'alicia_chanzia.webp',
    'alissa_galliamova.webp', 'allisa_astri.webp', 'althea_callista.webp',
    'alycia_ferryana.webp', 'amanda_dwi_arista.webp', 'amanda_priscella.webp',
    'amanina_afiqah.webp', 'amirah_fatin.webp', 'anastasya_narwastu.webp',
    'andela_yuwono.webp', 'anggie_putri_kurniasari.webp', 'anggita_destiana.webp',
    'aninditha_rahma_cahyadi.webp', 'annisa_athia.webp', 'ariella_calista.webp',
    'aulia_asyira.webp', 'aurel_mayori.webp', 'ayana_shahab.webp',
    'ayu_safira_oktaviani.webp', 'azizi_asadel.webp', 'beby_chaesara_anadila.webp',
    'caithlyn_gwyneth.webp', 'calista_lea.webp', 'callista_alifia.webp',
    'chalista_ellysia.webp', 'chikano_rina.jpg', 'chikita_ravenska_mamesah.webp',
    'chintya_hanindhitakirana.webp', 'christabel_jocelyn.webp', 'christi.webp',
    'cindy_gulla.webp', 'cindy_hapsari.webp', 'cindy_nugroho.webp',
    'cindy_yuvia.webp', 'citra_ayu.webp', 'cleopatra.webp',
    'danessa_valerie.webp', 'delima_rizky.webp', 'della_delila.webp',
    'dellia_erdita.webp', 'dena_siti_rohyati.webp', 'denise_caroline.webp',
    'devi_kinal_putri.webp', 'devytha_maharani.webp', 'dhea_angelia.webp',
    'diani_amalia.webp', 'diasta_priswarini.webp', 'dwi_putri_bonita.webp',
    'elaine_hartanto.webp', 'elizabeth_gloria.webp', 'eriena_kartika.webp',
    'erika_ebisawa.webp', 'erika_sintia.webp', 'eve_antoinette.webp',
    'fahira.webp', 'fakhriyani_shafariyanti.webp', 'farina_yogi_devani.webp',
    'febi_komaril.webp', 'febrina_diponegoro.webp', 'fidly_immanda.webp',
    'flora_shafiq.webp', 'fransisca_saraswati_puspa_dewi.webp',
    'frieska_anastasia_laksani.webp', 'gabriella.jpg', 'gabriella_stevany.webp',
    'gabriel_angelina.webp', 'gabryela_marcelina.webp', 'ghaida_farisya.webp',
    'graciella_ruth.webp', 'haruka_nakagawa.jpg', 'hasyakyla_utami.webp',
    'helma_sonya.webp', 'indah_permata_sari.webp', 'intania_pratama_ilham.webp',
    'intar_putri_kariina.webp', 'iris_vevina_prasetio.webp', 'jeane_victoria.webp',
    'jennifer_hanna.webp', 'jennifer_rachel_natasya.webp', 'jessica_berliana.webp',
    'jessica_vania.webp', 'jessica_veranda.jpg', 'jesslyn_callista.webp',
    'jihan_miftahul.webp', 'jinan_safa_safira.webp', 'kandiya_rafa.webp',
    'kanya_caya.webp', 'keisya_ramadhani.webp', 'kezia_putri_andinta.webp',
    'letycia_moreen.webp', 'lidya_maulida_djuhandar.webp'
];

// Helper function to properly capitalize member names
const formatMemberName = (filename) => {
    return filename
        .split('.')[0] // Remove file extension
        .split('_') // Split by underscore
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize each word
        .join(' '); // Join with spaces
};

const Tierlist = () => {
    const [rows, setRows] = useState(initialRows);
    const [poolImages, setPoolImages] = useState([]);
    const [rowImages, setRowImages] = useState({});
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingRow, setEditingRow] = useState({ name: '', color: '' });
    const [isDragging, setIsDragging] = useState(false);
    const [autoScrolling, setAutoScrolling] = useState(false);
    const scrollTimeoutRef = useRef(null);
    const [dragPosition, setDragPosition] = useState(null);
    const animationFrameRef = useRef(null);
    const forceUpdateRef = useRef(0);

    useEffect(() => {
        // Create portal container for dragging
        const portal = document.createElement('div');
        portal.id = 'drag-portal';
        document.body.appendChild(portal);

        return () => {
            document.body.removeChild(portal);
        };
    }, []);

    useEffect(() => {
        // For testing, let's just load active members
        const imageList = activeMembers.map((filename, index) => ({
            id: `member-${index}`,
            src: `/asset/member_active/${filename}`,
            name: formatMemberName(filename)
        }));

        console.log('Loaded images:', imageList);
        setPoolImages(imageList);

        // Initialize empty arrays for each row
        const initialRowImages = {};
        rows.forEach(row => {
            initialRowImages[row.id] = [];
        });
        setRowImages(initialRowImages);
    }, []);

    // Modify moveImage to be more immediate
    const moveImage = useCallback((source, destination, draggableId) => {
        if (!destination) return;

        const sourceId = source.droppableId;
        const destId = destination.droppableId;
        const sourceIndex = source.index;
        const destIndex = destination.index;

        // Don't do anything if dropped in the same location
        if (sourceId === destId && sourceIndex === destIndex) return;

        // Find the moved item from the source
        let movedItem;
        if (sourceId === 'image-pool') {
            movedItem = poolImages[sourceIndex];
        } else {
            movedItem = rowImages[sourceId]?.[sourceIndex];
        }

        // If we couldn't find the item, return
        if (!movedItem) return;

        setPoolImages(prevPoolImages => {
            const newPoolImages = [...prevPoolImages];
            if (sourceId === 'image-pool') {
                newPoolImages.splice(sourceIndex, 1);
            }
            if (destId === 'image-pool') {
                newPoolImages.splice(destIndex, 0, movedItem);
            }
            return newPoolImages;
        });

        setRowImages(prevRowImages => {
            const newRowImages = { ...prevRowImages };
            if (sourceId !== 'image-pool') {
                if (!newRowImages[sourceId]) newRowImages[sourceId] = [];
                newRowImages[sourceId] = [...newRowImages[sourceId]];
                newRowImages[sourceId].splice(sourceIndex, 1);
            }
            if (destId !== 'image-pool') {
                if (!newRowImages[destId]) newRowImages[destId] = [];
                newRowImages[destId] = [...newRowImages[destId]];
                newRowImages[destId].splice(destIndex, 0, movedItem);
            }
            return newRowImages;
        });
    }, []);

    const resetDragStyles = useCallback((elementId) => {
        const element = document.querySelector(`[data-rbd-draggable-id="${elementId}"]`);
        if (element) {
            element.style.position = '';
            element.style.top = '';
            element.style.left = '';
            element.style.transform = '';
            element.style.zIndex = '';
            element.style.cursor = 'grab';
            element.classList.remove('dragging');
            element.classList.remove('dragging-source');
        }
    }, []);

    // Add auto-scroll handling
    const handleAutoScroll = useCallback((clientY) => {
        const windowHeight = window.innerHeight;
        const scrollThreshold = 150; // pixels from top/bottom to trigger scroll
        const scrollSpeed = 10;

        if (clientY < scrollThreshold) {
            // Scroll up
            window.scrollBy(0, -scrollSpeed);
            return true;
        } else if (clientY > windowHeight - scrollThreshold) {
            // Scroll down
            window.scrollBy(0, scrollSpeed);
            return true;
        }
        return false;
    }, []);

    // Force continuous updates during drag
    useEffect(() => {
        if (isDragging) {
            const updateLoop = () => {
                forceUpdateRef.current += 1;
                setDragPosition(prev => prev ? { ...prev, timestamp: Date.now() } : null);
                animationFrameRef.current = requestAnimationFrame(updateLoop);
            };
            animationFrameRef.current = requestAnimationFrame(updateLoop);
        }

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [isDragging]);

    const onDragStart = useCallback((start) => {
        setIsDragging(true);
        document.body.style.cursor = 'grabbing';
        document.body.classList.add('is-dragging');
        setDragPosition({ x: 0, y: 0, timestamp: Date.now() });

        const draggedEl = document.querySelector(`[data-rbd-draggable-id="${start.draggableId}"]`);
        if (draggedEl) {
            draggedEl.style.cursor = 'grabbing';
            draggedEl.classList.add('dragging');
            // Ensure the dragged element is positioned relative to the viewport
            draggedEl.style.position = 'fixed';
            draggedEl.style.zIndex = '9999';
            draggedEl.style.pointerEvents = 'none';
        }

        // Add a class to handle overflow
        document.documentElement.classList.add('dragging-active');
    }, []);

    const onDragUpdate = useCallback((update) => {
        if (!update.destination) {
            resetDragStyles(update.draggableId);
            return;
        }

        const draggedEl = document.querySelector(`[data-rbd-draggable-id="${update.draggableId}"]`);
        if (draggedEl && update.clientX && update.clientY) {
            // Handle auto-scrolling
            const isScrolling = handleAutoScroll(update.clientY);
            if (isScrolling && !autoScrolling) {
                setAutoScrolling(true);
                document.body.classList.add('auto-scrolling');
            } else if (!isScrolling && autoScrolling) {
                setAutoScrolling(false);
                document.body.classList.remove('auto-scrolling');
            }

            // Clear previous timeout
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }

            // Set new timeout
            scrollTimeoutRef.current = setTimeout(() => {
                setAutoScrolling(false);
                document.body.classList.remove('auto-scrolling');
            }, 150);

            // Update drag position state to force re-render
            setDragPosition({
                x: update.clientX,
                y: update.clientY,
                timestamp: Date.now()
            });

            // Update dragged element position using transform for better performance
            requestAnimationFrame(() => {
                const x = update.clientX;
                const y = update.clientY;
                draggedEl.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%) scale(1.05)`;
                draggedEl.style.position = 'fixed';
                draggedEl.style.top = '0';
                draggedEl.style.left = '0';
                draggedEl.style.zIndex = '9999';
                draggedEl.style.pointerEvents = 'none';
            });
        }
    }, [handleAutoScroll, autoScrolling, resetDragStyles]);

    const onDragEnd = useCallback((result) => {
        setIsDragging(false);
        setAutoScrolling(false);
        setDragPosition(null);
        document.body.style.cursor = '';
        document.body.classList.remove('is-dragging', 'auto-scrolling');
        document.documentElement.classList.remove('dragging-active');
        
        if (scrollTimeoutRef.current) {
            clearTimeout(scrollTimeoutRef.current);
        }

        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
        }

        resetDragStyles(result.draggableId);

        // Clean up any stuck dragging classes and styles
        document.querySelectorAll('.member-image').forEach(el => {
            el.classList.remove('dragging', 'dragging-source');
            el.style.position = '';
            el.style.top = '';
            el.style.left = '';
            el.style.transform = '';
            el.style.zIndex = '';
            el.style.cursor = 'grab';
            el.style.pointerEvents = '';
        });

        if (!result.destination) return;

        // Perform the move immediately
        moveImage(result.source, result.destination, result.draggableId);
    }, [moveImage, resetDragStyles]);

    // Cleanup function for unexpected interruptions
    useEffect(() => {
        const cleanup = () => {
            document.body.style.cursor = '';
            document.querySelectorAll('.member-image').forEach(el => {
                el.classList.remove('dragging', 'dragging-source');
                el.style.position = '';
                el.style.top = '';
                el.style.left = '';
                el.style.transform = '';
                el.style.zIndex = '';
                el.style.cursor = 'grab';
            });
        };

        // Add event listeners for unexpected interruptions
        window.addEventListener('mouseup', cleanup);
        window.addEventListener('dragend', cleanup);
        window.addEventListener('blur', cleanup);

        return () => {
            cleanup();
            window.removeEventListener('mouseup', cleanup);
            window.removeEventListener('dragend', cleanup);
            window.removeEventListener('blur', cleanup);
        };
    }, []);

    const handleRowEdit = (row) => {
        setEditingRow(row);
        setDialogOpen(true);
    };

    const handleRowSave = () => {
        setRows(rows.map(row => 
            row.id === editingRow.id ? { ...row, ...editingRow } : row
        ));
        setDialogOpen(false);
    };

    const handleRowMove = (rowId, direction) => {
        const index = rows.findIndex(row => row.id === rowId);
        if ((direction === 'up' && index === 0) || 
            (direction === 'down' && index === rows.length - 1)) return;

        const newRows = [...rows];
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        [newRows[index], newRows[newIndex]] = [newRows[newIndex], newRows[index]];
        setRows(newRows);
    };

    const handleRowClear = (rowId) => {
        const clearedImages = rowImages[rowId] || [];
        setPoolImages([...poolImages, ...clearedImages]);
        setRowImages({
            ...rowImages,
            [rowId]: []
        });
    };

    const handleAddRow = () => {
        const newRow = {
            id: `row-${rows.length + 1}`,
            name: `New Tier ${rows.length + 1}`,
            color: '#808080'
        };
        setRows([...rows, newRow]);
        setRowImages({
            ...rowImages,
            [newRow.id]: []
        });
    };

    return (
        <DragDropContext 
            onDragStart={onDragStart}
            onDragUpdate={onDragUpdate}
            onDragEnd={onDragEnd}
        >
            <div 
                className={`tierlist-container ${isDragging ? 'is-dragging' : ''} ${autoScrolling ? 'auto-scrolling' : ''}`}
                data-force-update={dragPosition ? dragPosition.timestamp : undefined}
            >
                {rows.map((row) => (
                    <div key={row.id} className="tier-row">
                        <div className="row-header" style={{ backgroundColor: row.color }}>
                            <span>{row.name}</span>
                            <div className="row-controls">
                                <IconButton onClick={() => handleRowMove(row.id, 'up')} size="small">
                                    <ArrowUpward />
                                </IconButton>
                                <IconButton onClick={() => handleRowMove(row.id, 'down')} size="small">
                                    <ArrowDownward />
                                </IconButton>
                                <IconButton onClick={() => handleRowEdit(row)} size="small">
                                    <Edit />
                                </IconButton>
                                <IconButton onClick={() => handleRowClear(row.id)} size="small">
                                    <Delete />
                                </IconButton>
                            </div>
                        </div>
                        <StrictModeDroppable droppableId={row.id} direction="horizontal">
                            {(provided, snapshot) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className={`tier-content ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
                                >
                                    {(rowImages[row.id] || []).map((image, index) => (
                                        <Draggable
                                            key={image.id}
                                            draggableId={image.id}
                                            index={index}
                                        >
                                            {(provided, snapshot) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    className={`member-image ${snapshot.isDragging ? 'dragging' : ''} ${snapshot.draggingOver ? 'dragging-over' : ''}`}
                                                    style={{
                                                        ...provided.draggableProps.style,
                                                        cursor: snapshot.isDragging ? 'grabbing' : 'grab'
                                                    }}
                                                >
                                                    <img src={image.src} alt={image.name} />
                                                    <div className="member-name">{image.name}</div>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </StrictModeDroppable>
                    </div>
                ))}

                <Button 
                    variant="contained" 
                    color="primary" 
                    startIcon={<Add />}
                    onClick={handleAddRow}
                    className="add-row-button"
                >
                    Add New Tier
                </Button>

                <div className="image-pool-container">
                    <h2>Available Members ({poolImages.length})</h2>
                    <StrictModeDroppable droppableId="image-pool" direction="horizontal">
                        {(provided, snapshot) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className={`image-pool ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
                            >
                                {poolImages.map((image, index) => (
                                    <Draggable
                                        key={image.id}
                                        draggableId={image.id}
                                        index={index}
                                    >
                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                className={`member-image ${snapshot.isDragging ? 'dragging' : ''}`}
                                                style={{
                                                    ...provided.draggableProps.style,
                                                    cursor: snapshot.isDragging ? 'grabbing' : 'grab'
                                                }}
                                            >
                                                <img src={image.src} alt={image.name} />
                                                <div className="member-name">{image.name}</div>
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </StrictModeDroppable>
                </div>

                <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                    <DialogTitle>Edit Row</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Row Name"
                            fullWidth
                            value={editingRow.name}
                            onChange={(e) => setEditingRow({ ...editingRow, name: e.target.value })}
                        />
                        <TextField
                            margin="dense"
                            label="Background Color"
                            fullWidth
                            value={editingRow.color}
                            onChange={(e) => setEditingRow({ ...editingRow, color: e.target.value })}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleRowSave}>Save</Button>
                    </DialogActions>
                </Dialog>
            </div>
        </DragDropContext>
    );
};

export default Tierlist;