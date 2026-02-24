import { decryptWithMasterKey, encryptWithMasterKey } from './encryption';

export async function addOrUpdateKeyValue(key: string, value: string) {
	const valueEncrypted = await encryptWithMasterKey(value);

	await fetch(`/api/user/keyValue/${key}`, {
		method: 'POST',
		credentials: 'same-origin',
		body: JSON.stringify({
			valueCipher: valueEncrypted?.cipher,
			valueNonce: valueEncrypted?.nonce
		})
	});
}

export async function deleteKeyValue(key: string) {
	await fetch(`/api/user/keyValue/${key}`, {
		method: 'DELETE',
		credentials: 'same-origin'
	});
}

export type KeyValue = boolean | number | string[] | string | object | undefined;

export async function getKeyValue(key: string): Promise<KeyValue | null> {
	const resp = await fetch(`/api/user/keyValue/${key}`, {
		method: 'GET',
		credentials: 'same-origin'
	});

	if (!resp.ok) return null;

	const respJson = await resp.json();
	return (await decryptWithMasterKey(respJson.valueNonce, respJson.valueCipher)) ?? null;
}
