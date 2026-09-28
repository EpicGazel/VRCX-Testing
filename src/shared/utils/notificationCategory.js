import dayjs from 'dayjs';

const FRIEND_TYPES = new Set([
    'friendRequest',
    'ignoredFriendRequest',
    'invite',
    'requestInvite',
    'inviteResponse',
    'requestInviteResponse',
    'boop',
    'inviteSent',
    'requestInviteSent',
    'boopSent'
]);
const GROUP_TYPES_PREFIX = ['group.', 'moderation.'];
const GROUP_EXACT_TYPES = new Set(['groupChange', 'event.announcement']);

/**
 * Local-only types for outgoing invites / invite-requests / boops.
 * They group separately from received notifications of the same kind.
 */
const OUTGOING_NOTIFICATION_TYPES = new Set(['inviteSent', 'requestInviteSent', 'boopSent']);

/**
 * Whether a notification type is a locally logged outgoing send.
 *
 * @param {string} type
 * @returns {boolean}
 */
function isOutgoingNotificationType(type) {
    return OUTGOING_NOTIFICATION_TYPES.has(type);
}

/**
 * Determine the category of a notification type.
 *
 * @param {string} type
 * @returns {'friend' | 'group' | 'other'}
 */
function getNotificationCategory(type) {
    if (!type) return 'other';
    if (FRIEND_TYPES.has(type)) return 'friend';
    if (GROUP_EXACT_TYPES.has(type) || GROUP_TYPES_PREFIX.some((p) => type.startsWith(p))) return 'group';
    return 'other';
}

/**
 * Extract a millisecond timestamp from a notification object.
 *
 * @param {object} n - A notification with created_at or createdAt field
 * @returns {number}
 */
function getNotificationTs(n) {
    const raw = n.created_at ?? n.createdAt;
    if (typeof raw === 'number') return raw > 1e12 ? raw : raw * 1000;
    const ts = dayjs(raw).valueOf();
    return Number.isFinite(ts) ? ts : 0;
}

export {
    FRIEND_TYPES,
    GROUP_TYPES_PREFIX,
    GROUP_EXACT_TYPES,
    OUTGOING_NOTIFICATION_TYPES,
    isOutgoingNotificationType,
    getNotificationCategory,
    getNotificationTs
};
