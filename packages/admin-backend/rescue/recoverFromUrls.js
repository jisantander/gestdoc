require("dotenv").config();
const { S3Client, ListObjectsV2Command } = require("@aws-sdk/client-s3");
const fs = require("fs");

const { S3_KEY, S3_SECRET, S3_REGION, S3_BUCKET } = process.env;

// Configura el cliente de S3
const s3 = new S3Client({
	region: S3_REGION,
	credentials: {
		accessKeyId: S3_KEY,
		secretAccessKey: S3_SECRET,
	},
});

const bucketName = S3_BUCKET; // Reemplaza esto con el nombre de tu bucket

async function findS3Files(mongoIds, bucketName) {
	const mongoIdToUrl = [];

	let cont = 0;
	for (const id of mongoIds) {
		const command = new ListObjectsV2Command({
			Bucket: bucketName,
			Prefix: id,
		});

		try {
			let item = { _id: { $oid: id }, origin: "rescue" };
			const data = await s3.send(command);

			if (data.Contents && data.Contents.length > 0) {
				const key = data.Contents[0].Key;
				const url = `https://${bucketName}.s3.amazonaws.com/${key}`;
				item.url = url;
				mongoIdToUrl.push(item);
			}
		} catch (err) {
			console.error(`Error al buscar archivos para el ID ${id}:`, err);
		}
		console.log(cont);
		cont++;
	}

	return mongoIdToUrl;
}

// Lee el archivo JSON
fs.readFile("gestdoc.urls.json", "utf8", (err, data) => {
	if (err) {
		console.error("Error al leer el archivo:", err);
		return;
	}

	// Parsea el contenido del archivo como JSON
	const jsonArray = JSON.parse(data);

	// Extrae los IDs de MongoDB de cada objeto en el array
	const mongoIds = jsonArray.map((item) => item.rxsUrl.split("/")[2]);

	// Llama a la función con los IDs extraídos
	findS3Files(mongoIds, bucketName)
		.then((mongoIdToUrl) => {
			// Escribe el resultado en un archivo JSON
			fs.writeFile("procedures.json", JSON.stringify(mongoIdToUrl, null, 2), (err) => {
				if (err) {
					console.error("Error al escribir el archivo:", err);
				} else {
					console.log("Archivo escrito exitosamente.");
				}
			});
		})
		.catch((err) => console.error("Error al buscar archivos:", err));
});
