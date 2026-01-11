'use strict';

const { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { Upload } = require('@aws-sdk/lib-storage');
const fs = require('fs');

// Configuración de S3
let s3Config;
try {
	s3Config = require('../s3_config.json');
} catch (err) {
	console.warn('s3_config.json not found, using environment variables');
	s3Config = {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
		region: process.env.AWS_REGION || 'us-east-1'
	};
}

// Cliente S3
const s3Client = new S3Client({
	region: s3Config.region,
	credentials: {
		accessKeyId: s3Config.accessKeyId,
		secretAccessKey: s3Config.secretAccessKey
	}
});

/**
 * Sube un archivo a S3
 * @param {Object} params - Parámetros de subida
 * @param {string} params.bucket - Nombre del bucket
 * @param {string} params.key - Key/path del archivo en S3
 * @param {Buffer|Stream} params.body - Contenido del archivo
 * @param {string} params.contentType - Tipo de contenido
 * @returns {Promise<Object>} Resultado de la subida
 */
async function uploadFile({ bucket, key, body, contentType }) {
	try {
		const upload = new Upload({
			client: s3Client,
			params: {
				Bucket: bucket,
				Key: key,
				Body: body,
				ContentType: contentType || 'application/octet-stream'
			}
		});

		const result = await upload.done();
		return result;
	} catch (err) {
		console.error('Error uploading to S3:', err);
		throw err;
	}
}

/**
 * Descarga un archivo de S3
 * @param {Object} params - Parámetros de descarga
 * @param {string} params.bucket - Nombre del bucket
 * @param {string} params.key - Key/path del archivo en S3
 * @returns {Promise<Buffer>} Contenido del archivo
 */
async function downloadFile({ bucket, key }) {
	try {
		const command = new GetObjectCommand({
			Bucket: bucket,
			Key: key
		});

		const response = await s3Client.send(command);
		
		// Convertir stream a buffer
		const chunks = [];
		for await (const chunk of response.Body) {
			chunks.push(chunk);
		}
		
		return Buffer.concat(chunks);
	} catch (err) {
		console.error('Error downloading from S3:', err);
		throw err;
	}
}

/**
 * Elimina un archivo de S3
 * @param {Object} params - Parámetros de eliminación
 * @param {string} params.bucket - Nombre del bucket
 * @param {string} params.key - Key/path del archivo en S3
 * @returns {Promise<Object>} Resultado de la eliminación
 */
async function deleteFile({ bucket, key }) {
	try {
		const command = new DeleteObjectCommand({
			Bucket: bucket,
			Key: key
		});

		const result = await s3Client.send(command);
		return result;
	} catch (err) {
		console.error('Error deleting from S3:', err);
		throw err;
	}
}

/**
 * Genera URL pública de un archivo en S3
 * @param {string} bucket - Nombre del bucket
 * @param {string} key - Key/path del archivo
 * @param {string} region - Región de AWS
 * @returns {string} URL pública
 */
function getPublicUrl(bucket, key, region = s3Config.region) {
	return `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
}

module.exports = {
	s3Client,
	uploadFile,
	downloadFile,
	deleteFile,
	getPublicUrl
};
