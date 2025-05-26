import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    DndContext,
    DragOverlay,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    defaultDropAnimationSideEffects,
    pointerWithin,
    useDroppable,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    rectSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
    IconButton, 
    Dialog, 
    DialogTitle, 
    DialogContent, 
    TextField, 
    Button, 
    DialogActions,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Grid,
    Box,
    Tooltip
} from '@mui/material';
import { 
    Settings, 
    ArrowUpward, 
    ArrowDownward, 
    Edit, 
    Delete, 
    Add, 
    Refresh, 
    Save,
    Check,
    ArrowBack
} from '@mui/icons-material';
import html2canvas from 'html2canvas';
import './Tierlist.css';
import logo from '../src/assets/icon/TierlistIcon.png';

const TIER_COLORS = [
    { name: 'Red', value: '#FF7F7F' },
    { name: 'Orange', value: '#FFBF7F' },
    { name: 'Yellow', value: '#FFFF7F' },
    { name: 'Light Green', value: '#BFFF7F' },
    { name: 'Green', value: '#7FFF7F' },
    { name: 'Aqua', value: '#7FFFFF' },
    { name: 'Light Blue', value: '#7FBFFF' },
    { name: 'Blue', value: '#7F7FFF' },
    { name: 'Purple', value: '#BF7FFF' },
    { name: 'Pink', value: '#FF7FFF' },
    { name: 'Brown', value: '#BF7F3F' },
    { name: 'Gray', value: '#BFBFBF' },
    { name: 'Dark Gray', value: '#7F7F7F' },
    { name: 'White', value: '#FFFFFF' }
];

// Helper function to calculate contrasting text color
const getContrastColor = (hexcolor) => {
    // Convert hex to RGB
    const r = parseInt(hexcolor.substr(1,2), 16);
    const g = parseInt(hexcolor.substr(3,2), 16);
    const b = parseInt(hexcolor.substr(5,2), 16);
    
    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    return luminance > 0.5 ? '#000000' : '#FFFFFF';
};

const initialRows = [
    { id: 'S', name: 'S Tier', color: '#FF7F7F' },
    { id: 'A', name: 'A Tier', color: '#FFBF7F' },
    { id: 'B', name: 'B Tier', color: '#FFDF7F' },
    { id: 'C', name: 'C Tier', color: '#FFFF7F' },
    { id: 'D', name: 'D Tier', color: '#7FFF7F' }
];

const activeMemberFiles = [
    'Gen3_feni_fitriyanti.jpg', 'Gen3_shania_gracia.jpg',
    'Gen6_gita_sekar_andarini.jpg',
    'Gen7_angelina_christy.jpg', 'Gen7_febriola_sinambela.jpg',
    'Gen7_freya_jayawardana.jpg', 'Gen7_helisma_putri.jpg',
    'Gen7_jessica_chandra.jpg', 'Gen7_mutiara_azzahra.jpg',
    'Gen8_cornelia_vanisa.jpg', 'Gen8_fiony_alveria.jpg',
    'Gen8_lulu_salsabila.jpg',
    'Gen9_indah_cahya.jpg', 'Gen9_kathrina_irene.jpg',
    'Gen9_marsha_lenathea.jpg',
    'Gen10_amanda_sukma.jpg', 'Gen10_aurellia.jpg',
    'Gen10_gabriela_abigail.jpg', 'Gen10_indira_seruni.jpg',
    'Gen10_jesslyn_elly.jpg', 'Gen10_raisha_syifa.jpg',
    'Gen11_alya_amanda.jpg', 'Gen11_anindya_ramadhani.jpg',
    'Gen11_cathleen_nixie.jpg', 'Gen11_celline_thefani.jpg',
    'Gen11_chelsea_davina.jpg', 'Gen11_cynthia_yaputera.jpg',
    'Gen11_dena_natalia.jpg', 'Gen11_desy_natalia.jpg',
    'Gen11_gendis_mayrannisa.jpg', 'Gen11_grace_octaviani.jpg',
    'Gen11_greesella_adhalia.jpg', 'Gen11_michelle_alexandra.jpg',
    'Gen12_abigail_rachel.jpg', 'Gen12_adeline_wijaya.jpg',
    'Gen12_aurhel_alana.jpg', 'Gen12_catherina_vallencia.jpg',
    'Gen12_fritzy_rosmerian.jpg', 'Gen12_hillary_abigail.jpg',
    'Gen12_jazzlyn_trisha.jpg', 'Gen12_michelle_levia.jpg',
    'Gen12_nayla_suji.jpg', 'Gen12_nina_tutachia.jpg',
    'Gen12_oline_manuel.jpg', 'Gen12_regina_wilian.jpg',
    'Gen12_ribka_budiman.jpg', 'Gen12_shabilqis_naila.jpg',
    'Gen12_victoria_kimberly.jpg',
    'Gen13_Astrella_Virgiananda.jpg', 'Gen13_Aulia_Riza.jpg',
    'Gen13_Bong_Aprilli.jpg', 'Gen13_Hagia_Sopia.jpg',
    'Gen13_Humaira_Ramadhani.jpg', 'Gen13_Jacqueline_Immanuela.jpg',
    'Gen13_Jemima_Evodie.jpg', 'Gen13_Mikaela_Kusjanto.jpg',
    'Gen13_Nur_Intan.jpg'
];

const exMemberFiles = [
    // Gen1 members
    'Gen1/Gen1_aki_takajo.jpg', 'Gen1/Gen1_alissa_galliamova.webp', 'Gen1/Gen1_allisa_astri.webp',
    'Gen1/Gen1_ayana_shahab.webp', 'Gen1/Gen1_beby_chaesara_anadila.webp', 'Gen1/Gen1_cindy_gulla.webp',
    'Gen1/Gen1_cleopatra.webp', 'Gen1/Gen1_delima_rizky.webp', 'Gen1/Gen1_devi_kinal_putri.webp',
    'Gen1/Gen1_diasta_priswarini.webp', 'Gen1/Gen1_fahira.webp', 'Gen1/Gen1_frieska_anastasia_laksani.webp',
    'Gen1/Gen1_gabriella.jpg', 'Gen1/Gen1_ghaida_farisya.webp', 'Gen1/Gen1_haruka_nakagawa.jpg',
    'Gen1/Gen1_intania_pratama_ilham.webp', 'Gen1/Gen1_jessica_vania.webp', 'Gen1/Gen1_jessica_veranda.jpg',
    'Gen1/Gen1_melody_nurramdhani_laksani.webp', 'Gen1/Gen1_neneng_rosediana.webp', 'Gen1/Gen1_nozawa_rena.webp',
    'Gen1/Gen1_rezky_wiranti_dhike.webp', 'Gen1/Gen1_rica_leyona.webp', 'Gen1/Gen1_sendy_ariani.webp',
    'Gen1/Gen1_shania_junianatha.webp', 'Gen1/Gen1_siti_gayatri.webp', 'Gen1/Gen1_sonia_natalia.webp',
    'Gen1/Gen1_sonya_pandarmawan.webp', 'Gen1/Gen1_stella_cornelia.webp',
    
    // Gen2 members
    'Gen2/Gen2_alicia_chanzia.webp', 'Gen2/Gen2_althea_callista.webp', 'Gen2/Gen2_annisa_athia.webp',
    'Gen2/Gen2_chikano_rina.jpg', 'Gen2/Gen2_cindy_yuvia.webp', 'Gen2/Gen2_della_delila.webp',
    'Gen2/Gen2_dellia_erdita.webp', 'Gen2/Gen2_dena_siti_rohyati.webp', 'Gen2/Gen2_dwi_putri_bonita.webp',
    'Gen2/Gen2_fakhriyani_shafariyanti.webp', 'Gen2/Gen2_intar_putri_kariina.webp', 'Gen2/Gen2_jennifer_hanna.webp',
    'Gen2/Gen2_jennifer_rachel_natasya.webp', 'Gen2/Gen2_lidya_maulida_djuhandar.webp', 'Gen2/Gen2_nadhifa_karimah.webp',
    'Gen2/Gen2_nadila_cindi_wantari.webp', 'Gen2/Gen2_natalia.webp', 'Gen2/Gen2_noella_sisterina.webp',
    'Gen2/Gen2_novinta_dhini.webp', 'Gen2/Gen2_nurhalima_oktavianti.webp', 'Gen2/Gen2_octi_sevpin.webp',
    'Gen2/Gen2_olivia_robberecht.webp', 'Gen2/Gen2_priscillia_sari_dewi.webp', 'Gen2/Gen2_ratu_vienny_fitrilya.webp',
    'Gen2/Gen2_riskha_fairunissa.webp', 'Gen2/Gen2_rona_anggreani.webp', 'Gen2/Gen2_saktia_oktapyani.webp',
    'Gen2/Gen2_shinta_naomi.webp', 'Gen2/Gen2_sinka_juliani.webp', 'Gen2/Gen2_thalia.webp',
    'Gen2/Gen2_thalia_ivanka_elizabeth.webp', 'Gen2/Gen2_viviyona_apriani.webp',
    
    // Gen3 members
    'Gen3/Gen3_alycia_ferryana.webp', 'Gen3/Gen3_amanda_dwi_arista.webp', 'Gen3/Gen3_andela_yuwono.webp',
    'Gen3/Gen3_anggie_putri_kurniasari.webp', 'Gen3/Gen3_aninditha_rahma_cahyadi.webp', 'Gen3/Gen3_ayu_safira_oktaviani.webp',
    'Gen3/Gen3_chikita_ravenska_mamesah.webp', 'Gen3/Gen3_elaine_hartanto.webp', 'Gen3/Gen3_farina_yogi_devani.webp',
    'Gen3/Gen3_fransisca_saraswati_puspa_dewi.webp', 'Gen3/Gen3_indah_permata_sari.webp', 'Gen3/Gen3_kezia_putri_andinta.webp',
    'Gen3/Gen3_maria_genoveva_natalia_desy_purnamasari_gunawan.webp', 'Gen3/Gen3_martha_graciela.webp',
    'Gen3/Gen3_michelle_christo_kusnadi.webp', 'Gen3/Gen3_milenia_christien_glory_goenawan.webp',
    'Gen3/Gen3_nadhifa_salsabila.webp', 'Gen3/Gen3_nina_hamidah.webp', 'Gen3/Gen3_ni_made_ayu_vania_aurellia.webp',
    'Gen3/Gen3_pipit_ananda.webp', 'Gen3/Gen3_putri_farin_kartika.webp', 'Gen3/Gen3_rizka_khalila.webp',
    'Gen3/Gen3_shaffa_nabila.webp', 'Gen3/Gen3_shani_indira_natio.webp', 'Gen3/Gen3_sofia_meifaliani.webp',
    'Gen3/Gen3_stephanie_pricilla_indarto_putri.webp', 'Gen3/Gen3_syahfira_angela_nurhaliza.webp',
    'Gen3/Gen3_triarona_kusuma.webp', 'Gen3/Gen3_yansen_indiani.webp', 'Gen3/Gen3_zebi_magnolia_fawwaz.webp',
    
    // Gen4 members
    'Gen4/Gen4_adriani_elisabeth.webp', 'Gen4/Gen4_christi.webp', 'Gen4/Gen4_cindy_hapsari.webp',
    'Gen4/Gen4_fidly_immanda.webp', 'Gen4/Gen4_jessica_berliana.webp', 'Gen4/Gen4_jinan_safa_safira.webp',
    'Gen4/Gen4_made_devi.webp', 'Gen4/Gen4_mega_suryani.webp', 'Gen4/Gen4_melati_putri.webp',
    'Gen4/Gen4_nabilah_ratna_ayu_azalia.jpg', 'Gen4/Gen4_sri_lintang.webp', 'Gen4/Gen4_tan_zhi_hui_celine.jpg',
    'Gen4/Gen4_zahra_yuriva.webp',

    // Gen5 members
    'Gen5/Gen5_adhisty_zara.webp', 'Gen5/Gen5_anggita_destiana.webp', 'Gen5/Gen5_chintya_hanindhitakirana.webp',
    'Gen5/Gen5_citra_ayu.webp', 'Gen5/Gen5_diani_amalia.webp', 'Gen5/Gen5_elizabeth_gloria.webp',
    'Gen5/Gen5_eve_antoinette.webp', 'Gen5/Gen5_gabryela_marcelina.webp', 'Gen5/Gen5_hasyakyla_utami.webp',
    'Gen5/Gen5_helma_sonya.webp', 'Gen5/Gen5_nurhayati.webp', 'Gen5/Gen5_puti_nadhira.webp',
    'Gen5/Gen5_regina_angelina.webp', 'Gen5/Gen5_rissanda_putri.webp', 'Gen5/Gen5_ruth_damayanti.webp',
    'Gen5/Gen5_sania_julia.webp', 'Gen5/Gen5_violeta_burhan.webp',

    // Gen6 members
    'Gen6/Gen6_amanda_priscella.webp', 'Gen6/Gen6_anastasya_narwastu.webp', 'Gen6/Gen6_ariella_calista.webp',
    'Gen6/Gen6_denise_caroline.webp', 'Gen6/Gen6_erika_ebisawa.webp', 'Gen6/Gen6_erika_sintia.webp',
    'Gen6/Gen6_graciella_ruth.webp', 'Gen6/Gen6_jihan_miftahul.webp', 'Gen6/Gen6_kandiya_rafa.webp',
    'Gen6/Gen6_putri_cahyaning.webp', 'Gen6/Gen6_rinanda_syahputri.webp', 'Gen6/Gen6_riska_amelia.webp',
    'Gen6/Gen6_shalza_grasita.webp',

    // Gen7 members
    'Gen7/Gen7_aiko_harumi.webp', 'Gen7/Gen7_aurel_mayori.webp', 'Gen7/Gen7_azizi_asadel.webp',
    'Gen7/Gen7_calista_lea.webp', 'Gen7/Gen7_dhea_angelia.webp', 'Gen7/Gen7_febi_komaril.webp',
    'Gen7/Gen7_febrina_diponegoro.webp', 'Gen7/Gen7_gabriel_angelina.webp', 'Gen7/Gen7_jesslyn_callista.webp',
    'Gen7/Gen7_kanya_caya.webp', 'Gen7/Gen7_nabila_fitriana.webp', 'Gen7/Gen7_rifa_fatmasari.webp',
    'Gen7/Gen7_viona_fadrin.webp', 'Gen7/Gen7_yessica_tamara.webp',

    // Gen8 members
    'Gen8/Gen8_amanina_afiqah.webp', 'Gen8/Gen8_amirah_fatin.webp', 'Gen8/Gen8_cindy_nugroho.webp',
    'Gen8/Gen8_devytha_maharani.webp', 'Gen8/Gen8_eriena_kartika.webp', 'Gen8/Gen8_flora_shafiq.webp',
    'Gen8/Gen8_gabriella_stevany.webp', 'Gen8/Gen8_keisya_ramadhani.webp', 'Gen8/Gen8_nyimas_ratu_rafa.webp',
    'Gen8/Gen8_pamela_krysanthe.webp', 'Gen8/Gen8_reva_adriana.webp', 'Gen8/Gen8_reva_fidela.webp',
    'Gen8/Gen8_salma_annisa.webp', 'Gen8/Gen8_umega_maulana.webp', 'Gen8/Gen8_zahra_nur.webp',

    // Gen9 members
    'Gen9/Gen9_adzana_shaliha.webp', 'Gen9/Gen9_caithlyn_gwyneth.webp', 'Gen9/Gen9_chalista_ellysia.webp',
    'Gen9/Gen9_christabel_jocelyn.webp', 'Gen9/Gen9_iris_vevina_prasetio.webp', 'Gen9/Gen9_nabila_gusmarlia.webp',
    'Gen9/Gen9_olivia_payten.webp', 'Gen9/Gen9_putri_elzahra.webp', 'Gen9/Gen9_shinta_devi.webp',
    'Gen9/Gen9_tiara_sasi.webp',

    // Gen10 members
    'Gen10/Gen10_abieza_syabira.webp', 'Gen10/Gen10_alia_giselle.jpg', 'Gen10/Gen10_callista_alifia.webp',
    'Gen10/Gen10_danessa_valerie.webp', 'Gen10/Gen10_naura_safinatunnajah.webp',

    // Gen11 members
    'Gen11/Gen11_aulia_asyira.webp', 'Gen11/Gen11_jeane_victoria.webp',

    // Gen12 members
    'Gen12/Gen12_aisa_maharani.webp', 'Gen12/Gen12_letycia_moreen.webp'
];

// Helper function to properly capitalize member names
const formatMemberName = (filename) => {
    return filename
        .split('.')[0]  // Remove file extension
        .split('_')
        .slice(1)  // Skip the Gen*_ part
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
};

const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
        styles: {
            active: {
                opacity: '0.5',
            },
        },
    }),
};

const Droppable = ({id, children}) => {
    const {setNodeRef, isOver} = useDroppable({
        id: id,
    });

    return (
        <div 
            ref={setNodeRef} 
            className={`droppable ${isOver ? 'is-over' : ''}`}
            style={{ height: '100%' }}
        >
            {children}
        </div>
    );
};

const DraggableImage = ({ image, isDragging, dragOverlay }) => {
    const style = {
        opacity: isDragging ? 0.3 : 1,
        cursor: dragOverlay ? 'grabbing' : 'grab',
        position: dragOverlay ? 'fixed' : 'relative',
        width: '100px',
        height: '120px',
        zIndex: dragOverlay ? 999 : 1,
        backgroundColor: '#333',
    };

    return (
        <div
            className={`member-image ${isDragging ? 'dragging' : ''} ${dragOverlay ? 'overlay' : ''}`}
            style={style}
        >
            <img src={image.src} alt={image.name} />
            <div className="member-name">{image.name}</div>
        </div>
    );
};

const SortableImage = ({ image, isDragging }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ 
        id: image.id,
        data: {
            type: 'image',
            image,
        },
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
        >
            <DraggableImage image={image} isDragging={isDragging} />
        </div>
    );
};

const TierRow = ({ row, onMove, onEdit, onClear, onDelete, children }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleAction = (action) => {
        handleClose();
        switch(action) {
            case 'up':
                onMove(row.id, 'up');
                break;
            case 'down':
                onMove(row.id, 'down');
                break;
            case 'edit':
                onEdit(row);
                break;
            case 'clear':
                onClear(row.id);
                break;
            case 'delete':
                onDelete(row.id);
                break;
        }
    };

    const textColor = getContrastColor(row.color);

    return (
        <div className="tier-row">
            <div className="row-header" style={{ backgroundColor: row.color }}>
                <span style={{ color: textColor }}>{row.name}</span>
                <IconButton 
                    onClick={handleClick}
                    size="small"
                    style={{ color: textColor }}
                >
                    <Settings />
                </IconButton>
                <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                >
                    <MenuItem onClick={() => handleAction('up')}>
                        <ListItemIcon>
                            <ArrowUpward fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Move Up</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={() => handleAction('down')}>
                        <ListItemIcon>
                            <ArrowDownward fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Move Down</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={() => handleAction('edit')}>
                        <ListItemIcon>
                            <Edit fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Edit Name</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={() => handleAction('clear')}>
                        <ListItemIcon>
                            <Delete fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Clear Row</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={() => handleAction('delete')} sx={{ color: 'error.main' }}>
                        <ListItemIcon>
                            <Delete fontSize="small" sx={{ color: 'error.main' }} />
                        </ListItemIcon>
                        <ListItemText>Delete Row</ListItemText>
                    </MenuItem>
                </Menu>
            </div>
            {children}
        </div>
    );
};

const Tierlist = () => {
    const navigate = useNavigate();
    const tierlistRef = useRef(null);
    const tierRowsRef = useRef(null);
    const [rows, setRows] = useState(initialRows);
    const [images, setImages] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingRow, setEditingRow] = useState({ name: '', color: '' });
    const [activeId, setActiveId] = useState(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        const memberType = localStorage.getItem('memberType') || 'active';
        const generation = localStorage.getItem('generation') || 'all';
        
        console.log('Loading images with:', { memberType, generation });

        // Helper function to check if a filename matches the generation
        const matchesGeneration = (filename) => {
            if (generation === 'all') return true;
            const prefix = `Gen${generation.slice(3)}_`; // Convert 'gen3' to 'Gen3_'
            // Extract just the filename part if it contains a path
            const baseFilename = filename.includes('/') ? filename.split('/').pop() : filename;
            console.log('Checking file:', baseFilename, 'against prefix:', prefix);
            return baseFilename.startsWith(prefix);
        };

        let imageList = [];
        
        // Load active members if needed
        if (memberType === 'active' || memberType === 'all') {
            console.log('Active members before filter:', activeMemberFiles);
            const activeMemberImages = activeMemberFiles
                .filter(filename => matchesGeneration(filename))
                .map((filename) => ({
                    id: `member-${filename}`,
                    src: `/asset/member_active/${filename}`,
                    name: formatMemberName(filename),
                    containerId: 'image-pool'
                }));
            console.log('Filtered active members:', activeMemberImages);
            imageList = [...imageList, ...activeMemberImages];
        }

        // Load ex-members if needed
        if (memberType === 'ex' || memberType === 'all') {
            const exMembersList = exMemberFiles
                .filter(filename => matchesGeneration(filename))
                .map((filename) => ({
                    id: `member-${filename}`,
                    src: `/asset/exmember/${filename}`,
                    name: formatMemberName(filename),
                    containerId: 'image-pool'
                }));
            imageList = [...imageList, ...exMembersList];
        }

        console.log('Final image list:', imageList);
        setImages(imageList);
    }, [localStorage.getItem('memberType'), localStorage.getItem('generation')]);

    const handleDragStart = (event) => {
        const { active } = event;
        setActiveId(active.id);
    };

    const handleDragOver = (event) => {
        const { active, over } = event;
        
        if (!over) return;

        const overId = over.id;
        
        // If we're over a droppable container
        if (rows.find(row => row.id === overId) || overId === 'image-pool') {
            setImages(prev => {
                const activeImage = prev.find(img => img.id === active.id);
                if (activeImage.containerId === overId) return prev; // No change if same container
                
                // Remove the dragged image from its current position
                const newImages = prev.filter(img => img.id !== active.id);
                
                // Find all images in the target container
                const containerImages = newImages.filter(img => img.containerId === overId);
                
                // Find the index after the last image in the target container
                const lastContainerImageIndex = newImages.findIndex(img => 
                    img.containerId === overId && 
                    containerImages.indexOf(img) === containerImages.length - 1
                );
                
                // Create the updated image with new container
                const updatedImage = { ...activeImage, containerId: overId };
                
                // If there are no images in the container or we couldn't find the last image
                if (containerImages.length === 0 || lastContainerImageIndex === -1) {
                    // Just append to the end of the array
                    return [...newImages, updatedImage];
                }
                
                // Insert after the last image in the container
                newImages.splice(lastContainerImageIndex + 1, 0, updatedImage);
                return newImages;
            });
        }
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (!over) {
            setActiveId(null);
            return;
        }

        const overId = over.id;
        
        if (rows.find(row => row.id === overId) || overId === 'image-pool') {
            setImages(prev => {
                const activeImage = prev.find(img => img.id === active.id);
                const overContainer = overId;
                
                // Remove the dragged image from its current position
                const newImages = prev.filter(img => img.id !== active.id);
                
                // Find all images in the target container
                const containerImages = newImages.filter(img => img.containerId === overContainer);
                
                // Find the index after the last image in the target container
                const lastContainerImageIndex = newImages.findIndex(img => 
                    img.containerId === overContainer && 
                    containerImages.indexOf(img) === containerImages.length - 1
                );
                
                // Create the updated image with new container
                const updatedImage = { ...activeImage, containerId: overContainer };
                
                // If there are no images in the container or we couldn't find the last image
                if (containerImages.length === 0 || lastContainerImageIndex === -1) {
                    // Just append to the end of the array
                    return [...newImages, updatedImage];
                }
                
                // Insert after the last image in the container
                newImages.splice(lastContainerImageIndex + 1, 0, updatedImage);
                return newImages;
            });
        } else {
            // If dropping onto another image, swap positions
            const activeIndex = images.findIndex(img => img.id === active.id);
            const overIndex = images.findIndex(img => img.id === over.id);
            
            if (activeIndex !== -1 && overIndex !== -1) {
                setImages(prev => {
                    const activeImage = prev[activeIndex];
                    const overImage = prev[overIndex];
                    
                    // Only swap if they're in the same container
                    if (activeImage.containerId === overImage.containerId) {
                        return arrayMove(prev, activeIndex, overIndex);
                    }
                    return prev;
                });
            }
        }

        setActiveId(null);
    };

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
        setImages(prevImages => 
            prevImages.map(img => 
                img.containerId === rowId 
                    ? { ...img, containerId: 'image-pool' }
                    : img
            )
        );
    };

    const handleRowDelete = (rowId) => {
        // Move all images from the row to the image pool
        setImages(prevImages => 
            prevImages.map(img => 
                img.containerId === rowId 
                    ? { ...img, containerId: 'image-pool' }
                    : img
            )
        );
        // Remove the row
        setRows(prev => prev.filter(row => row.id !== rowId));
    };

    const handleAddRow = () => {
        const newRow = {
            id: `row-${rows.length + 1}`,
            name: `New Tier ${rows.length + 1}`,
            color: '#808080'
        };
        setRows(prev => [...prev, newRow]);
    };

    const getImagesForContainer = (containerId) => {
        return images.filter(img => img.containerId === containerId);
    };

    const activeImage = activeId ? images.find(img => img.id === activeId) : null;

    const handleReset = () => {
        // Reset rows to initial state
        setRows([...initialRows]);

        // Reset images to initial state
        const memberType = localStorage.getItem('memberType') || 'active';
        const generation = localStorage.getItem('generation') || 'all';

        // Helper function to check if a filename matches the generation
        const matchesGeneration = (filename) => {
            if (generation === 'all') return true;
            const prefix = `Gen${generation.slice(3)}_`; // Convert 'gen3' to 'Gen3_'
            return filename.startsWith(prefix);
        };

        let imageList = [];
        
        // Load active members if needed
        if (memberType === 'active' || memberType === 'all') {
            const activeMemberImages = activeMemberFiles
                .filter(filename => matchesGeneration(filename))
                .map((filename) => ({
                    id: `member-${filename}`,
                    src: `/asset/member_active/${filename}`,
                    name: formatMemberName(filename),
                    containerId: 'image-pool'
                }));
            imageList = [...imageList, ...activeMemberImages];
        }

        // Load ex-members if needed
        if (memberType === 'ex' || memberType === 'all') {
            const exMembersList = exMemberFiles
                .filter(filename => matchesGeneration(filename))
                .map((filename) => ({
                    id: `member-${filename}`,
                    src: `/asset/exmember/${filename}`,
                    name: formatMemberName(filename),
                    containerId: 'image-pool'
                }));
            imageList = [...imageList, ...exMembersList];
        }

        setImages(imageList);
    };

    const handleSave = async () => {
        if (!tierRowsRef.current) return;

        try {
            // Scale factor to get from 100x120 to 256x307.2 (maintaining aspect ratio)
            // 256/100 = 2.56
            const canvas = await html2canvas(tierRowsRef.current, {
                scale: 2.56,
                backgroundColor: '#1a1a2e',
                logging: false,
                useCORS: true,
                allowTaint: true,
                onclone: (clonedDoc) => {
                    // Ensure the cloned elements maintain their original aspect ratios
                    const images = clonedDoc.getElementsByClassName('member-image');
                    Array.from(images).forEach(img => {
                        img.style.height = '120px';  // Force original height
                        const imgElement = img.querySelector('img');
                        if (imgElement) {
                            imgElement.style.height = '100px';  // Force original image height
                        }
                    });
                }
            });

            // Convert to blob
            canvas.toBlob((blob) => {
                if (!blob) return;

                // Create download link
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'jkt48-tierlist.jpg';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
            }, 'image/jpeg', 0.95); // High quality JPEG
        } catch (error) {
            console.error('Error saving tierlist:', error);
        }
    };

    const handleBack = () => {
        navigate('/');
    };

    return (
        <>
            <header className="header">
                <IconButton 
                    className="back-button"
                    onClick={handleBack}
                    size="large"
                >
                    <ArrowBack />
                </IconButton>
                <img src={logo} alt="JKT48 Tierlist Logo" className="header-logo" />
                <h1 className="header-title">JKT48 Member Tierlist</h1>
            </header>
            <DndContext
                sensors={sensors}
                collisionDetection={pointerWithin}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
                onDragCancel={() => setActiveId(null)}
            >
                <div className="tierlist-container" ref={tierlistRef}>
                    <div className="tier-rows-container" ref={tierRowsRef}>
                        {rows.map((row) => (
                            <TierRow
                                key={row.id}
                                row={row}
                                onMove={handleRowMove}
                                onEdit={handleRowEdit}
                                onClear={handleRowClear}
                                onDelete={handleRowDelete}
                            >
                                <Droppable id={row.id}>
                                    <div className="tier-content">
                                        <SortableContext 
                                            items={getImagesForContainer(row.id).map(img => img.id)}
                                            strategy={rectSortingStrategy}
                                        >
                                            {getImagesForContainer(row.id).map((image) => (
                                                <SortableImage 
                                                    key={image.id} 
                                                    image={image}
                                                    isDragging={image.id === activeId}
                                                />
                                            ))}
                                        </SortableContext>
                                    </div>
                                </Droppable>
                            </TierRow>
                        ))}
                    </div>

                    <div className="button-container">
                        <Button 
                            variant="contained" 
                            color="primary" 
                            startIcon={<Add />}
                            onClick={handleAddRow}
                            className="action-button"
                        >
                            Add New Tier
                        </Button>
                        <Button 
                            variant="contained" 
                            color="secondary" 
                            startIcon={<Refresh />}
                            onClick={handleReset}
                            className="action-button"
                        >
                            Reset
                        </Button>
                        <Button 
                            variant="contained" 
                            color="success" 
                            startIcon={<Save />}
                            onClick={handleSave}
                            className="action-button"
                        >
                            Save as Image
                        </Button>
                    </div>

                    <div className="image-pool-container">
                        <h2>Available Members ({getImagesForContainer('image-pool').length})</h2>
                        <Droppable id="image-pool">
                            <div className="image-pool">
                                <SortableContext 
                                    items={getImagesForContainer('image-pool').map(img => img.id)}
                                    strategy={rectSortingStrategy}
                                >
                                    {getImagesForContainer('image-pool').map((image) => (
                                        <SortableImage 
                                            key={image.id} 
                                            image={image}
                                            isDragging={image.id === activeId}
                                        />
                                    ))}
                                </SortableContext>
                            </div>
                        </Droppable>
                    </div>

                    <DragOverlay>
                        {activeId ? (
                            <DraggableImage 
                                image={images.find(img => img.id === activeId)}
                                dragOverlay
                            />
                        ) : null}
                    </DragOverlay>
                </div>
            </DndContext>
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
                        sx={{ mb: 2 }}
                    />
                    <Box sx={{ mb: 1 }}>Row Color:</Box>
                    <Grid container spacing={1}>
                        {TIER_COLORS.map((color) => (
                            <Grid item key={color.value}>
                                <Tooltip title={color.name} arrow>
                                    <Box
                                        onClick={() => setEditingRow({ ...editingRow, color: color.value })}
                                        sx={{
                                            width: 40,
                                            height: 40,
                                            backgroundColor: color.value,
                                            border: '2px solid',
                                            borderColor: editingRow.color === color.value ? '#000' : 'transparent',
                                            borderRadius: 1,
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            '&:hover': {
                                                opacity: 0.8
                                            }
                                        }}
                                    >
                                        {editingRow.color === color.value && (
                                            <Check sx={{ 
                                                color: getContrastColor(color.value)
                                            }} />
                                        )}
                                    </Box>
                                </Tooltip>
                            </Grid>
                        ))}
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleRowSave}>Save</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default Tierlist;