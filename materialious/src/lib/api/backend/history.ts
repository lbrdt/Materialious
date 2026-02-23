import sodium from 'libsodium-wrappers-sumo';
import { encryptWithMasterKey, getRawKey, getSecureHash } from './encryption';
import type { VideoPlay } from '../model';
import { getBestThumbnail } from '$lib/images';

export async function updateWatchHistory(videoId: string, progress: number) {
	await sodium.ready;
	const rawKey = await getRawKey();
	if (!rawKey) return;

	const videoHash = await getSecureHash(videoId, rawKey);

	await fetch(`/api/user/history/${videoHash}`, {
		method: 'POST',
		credentials: 'same-origin',
		body: JSON.stringify({
			watched: new Date(),
			progress
		})
	});
}

export async function saveWatchHistory(video: VideoPlay, progress: number = 0) {
	await sodium.ready;
	const rawKey = await getRawKey();
	if (!rawKey) return;

	const videoHash = await getSecureHash(video.videoId, rawKey);

	const title = await encryptWithMasterKey(video.title);
	const author = await encryptWithMasterKey(video.author);
	const thumbnail = await encryptWithMasterKey(getBestThumbnail(video.videoThumbnails));
	const duration = await encryptWithMasterKey(video.lengthSeconds.toString());

	await fetch('/api/user/history', {
		method: 'POST',
		credentials: 'same-origin',
		body: JSON.stringify({
			id: videoHash,
			watched: new Date(),
			progress: progress,
			title: {
				cipher: title?.cipher,
				nonce: title?.nonce
			},
			author: {
				cipher: author?.cipher,
				nonce: author?.nonce
			},
			thumbnail: {
				cipher: thumbnail?.cipher,
				nonce: thumbnail?.nonce
			},
			duration: {
				cipher: duration?.cipher,
				nonce: duration?.nonce
			}
		})
	});
}
