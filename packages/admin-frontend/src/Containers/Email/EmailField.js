import React, { useState, } from 'react';
import {
    Card,
    Divider
} from '@material-ui/core';
import {
    Fab,
    InputAdornment,
    TextField
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CopyToClipboard } from 'react-copy-to-clipboard';

export default function EmailField(  ) {

    const arrayField = [ '{nombre_usuario_sesion}' , '{participantes}','{email_usuario_sesion}' ];
    const [copyClip, setCopyClip] = useState("");

    return (
            <>
                <Card className="p-4 mb-4">
                    <div className="font-size-lg font-weight-bold">Campos especiales para este sistema de correos</div>
                    <Divider className="my-4" />
                    <div className="p-3">
                        {  arrayField.map(text => (
                                <div style={{ margin: 10 }} >
                                    <TextField
                                        disabled
                                        variant="outlined"
                                        value={ text }
                                        fullWidth
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <CopyToClipboard
                                                        text={ text }
                                                        onCopy={(e) => setCopyClip(e)}>
                                                        <Fab size="small" color="primary">
                                                            <FontAwesomeIcon icon={['fas', 'save']} />
                                                        </Fab>
                                                    </CopyToClipboard>
                                                </InputAdornment>
                                            )
                                        }}
                                    />
                                </div>
                            ))
                        }
                        {copyClip !== "" ? (
                            <Alert className="mb-4" severity="success">
                                <span>
                                    Se a copiado <b>{copyClip}</b> en su portapapeles </span>
                            </Alert>
                        ) : null}
                    </div>
                </Card>
            </>
    );
}