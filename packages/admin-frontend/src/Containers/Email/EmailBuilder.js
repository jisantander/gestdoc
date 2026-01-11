import React, { useRef, useEffect, useState } from 'react';
import { get_email_id, put_email } from '../../services/Email';
import Save from '@material-ui/icons/Save';
import EmailEditor from 'react-email-editor';
import { useRouteMatch, } from 'react-router-dom';
import Snackbar from '@material-ui/core/Snackbar';
import Chip from '@material-ui/core/Chip';
import { useDispatch } from 'react-redux'
import { setSidebarName } from '../../reducers/ThemeOptions';
import {
    Grid,
    Card,
    TextField,
    Divider
} from '@material-ui/core';
import ShareOptionsForm from '../ThemeDocs/ShareOptionsForm';
import EmailField from './EmailField';
import imageEmail from '../../images/email.svg';

const Email = () => {
    const match = useRouteMatch();
    const emailEditorRef = useRef(null);
	const dispatch = useDispatch( );
    //snack Toas
    const [state, setState] = useState({
        open: false,
        vertical: 'top',
        horizontal: 'center',
        toastrStyle: '',
        message: 'This is a toastr/snackbar notification!'
    });
    const { vertical, horizontal, open, toastrStyle, message } = state;
    const handleClose = () => {
        setState({ ...state, open: false });
    };
    //fin snackj Toast
    const [chipData, setChipData] = useState([]);
    const [from, setFrom] = useState('');
    const [subject, setSubject] = useState('');

    useEffect(() => {
        get_email_id(match.params.id)
            .then((data) => { setChipData(prevArray => [...prevArray, ...data._recipient]); setSubject(data._subject); console.log('data', data) })
            .catch(() => console.log('Faild Connection'));
    }, [match.params.id]);

    const handleDelete = (chipToDelete) => () => {
        setChipData((chips) => chips.filter((chip) => chip !== chipToDelete));
    };

    const exportHtml = () => {
        /**
         * servicio de post con 
               _body: req.body._body,
              _template: req.body._template,
         */
        emailEditorRef.current.editor.exportHtml((data) => {
            const { design, html } = data;

            const obj = {
                _body: html,
                _template: design,
                _recipient: chipData,
                _subject: subject
            }
            put_email(obj, match.params.id)
                .then((data) => setState({ ...state, open: true, toastrStyle: 'toastr-success', message: 'Correo Guardado' }))
                .catch(() => console.log('Failed connection with API'));
            console.log('exportHtml', html);
        });
    };

    const onLoad = () => {


        get_email_id(match.params.id)
            .then((data) => {
                dispatch( setSidebarName(['Plantilla de Correo - '+ data._title, imageEmail] ) )
                console.log('get_email_id', data);
                const templateJson = data._template;
                emailEditorRef.current.editor.loadDesign(templateJson);
            })
            .catch(() => console.log('Failed connection with API'));
        // you can load your template here;
        // const templateJson = {};
        // emailEditorRef.current.editor.loadDesign(templateJson);
    };

    return (

        <>
            <Grid container spacing={4}>
                <Grid item xs={12} lg={10}>
                    <Card className="p-4 mb-4">
                        <div className="font-size-lg font-weight-bold" style={{ display: 'flex' }}>
                            <label>Para:</label>

                            <TextField
                                className="ml-2"
                                id="outlined-multiline-flexible"
                                label=""
                                value={from}
                                onChange={(event) => {
                                    setFrom(event.target.value);
                                }}
                                onKeyPress={(ev) => {
                                    if (ev.key === 'Enter') {
                                      setChipData(prevArray => [...prevArray, from]);
                                      setFrom('');
                                      ev.preventDefault();
                                    }
                                  }}
                                onBlur={() => {
                                    if (from !== '') {
                                        setChipData(prevArray => [...prevArray, from]);
                                        setFrom('');
                                    }
                                }}
                            />

                            <ul style={{ listStyleType: 'none', display: ' flex' }} >
                                {chipData.map((data) => {
                                    let icon;
                                    return (
                                        <li key={data}>
                                            <Chip
                                                icon={icon}
                                                label={data}
                                                onDelete={handleDelete(data)}
                                            />
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                        <Divider className="my-4" />
                        <div className="font-size-lg font-weight-bold">
                            <label>Asunto:</label>
                            <TextField
                                className="ml-2"
                                style={{ width: '90%' }}
                                id="outlined-multiline-flexible"
                                label=""
                                value={subject}
                                onChange={(event) => {
                                    setSubject(event.target.value);
                                }}
                            />
                        </div>
                    </Card>

                </Grid>
                <Grid item xs={12} lg={2}>
                    <Card className="p-2 mb-4">
                        <div className="d-flex align-items-center justify-content-center flex-wrap">
                            <button onClick={exportHtml} className="m-4  btn-input-select white">
                                <div className="d-30 d-flex align-items-center justify-content-center rounded-pill bg-secondary text-primary">
                                    <Save className="d-50" />
                                </div>
                                <div className="p-2 font-weight-bold text-primary opacity-6 mt-12">
                                    Guardar
                                </div>
                            </button>
                        </div>
                    </Card>

                </Grid>
            </Grid>

            <EmailEditor
                ref={emailEditorRef}
                onLoad={onLoad}
            />

            <Snackbar
                anchorOrigin={{ vertical, horizontal }}
                open={open}
                classes={{ root: toastrStyle }}
                onClose={handleClose}
                message={message}
            />

            <Grid className="mt-4" container spacing={4}>
                <Grid item xs={12} lg={8}>
                        <ShareOptionsForm   system ={'esta plantilla de correo'} />
                </Grid>
                <Grid item xs={12} lg={4}> 
                    <EmailField/>
                </Grid>
            </Grid>
        </>
    );
};

export default Email;