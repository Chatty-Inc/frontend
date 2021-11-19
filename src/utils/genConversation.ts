import { IMessageData } from '../components/utility/MainAppComponents/ChannelMessages';
import { loremIpsum, fullname } from 'react-lorem-ipsum';
import avatars from 'react-lorem-ipsum/dist/data/avatars.json';

/**
 * Generates a real-looking conversation for
 * testing UI layout. Does not generate an exact
 * number of conversation numbers as messages
 * per person are random.
 * @param {number} conversationItems - Approximate number of conversation items to generate
 */
export default function genConversation(conversationItems: number): IMessageData[] {
    const getRandomAvatar = (gender: 'male' | 'female'): string => {
        return avatars[gender][Math.floor(Math.random() * avatars[gender].length)];
    };
    const weightedRandom = (): number => {
        const n = Math.floor(Math.random() * 100);
        if (n < 80) return 0;
        if (n < 88) return 1;
        if (n < 93) return 2;
        if (n < 97) return 3;
        if (n < 99) return 4;
        else return 5;
    }

    const generatedConv: IMessageData[] = [];
    let currentTime = +new Date() - conversationItems * 15 * 60 * 1000;

    for (let i = 0; i < conversationItems; i++) {
        const carryOnConvItems = weightedRandom();

        // Generate params for this person
        const gender = Math.random() < .5 ? 'male' : 'female',
            name = fullname(gender),
            avatar = Math.random() < .75
            ? (Math.random() < .8
                    ? `https://picsum.photos/40.webp?random=${i + Math.floor(Math.random() * 1000)}`
                    : getRandomAvatar(gender)
            )
            : undefined

        for (let x = 0; x <= carryOnConvItems; x++) {

            generatedConv.push({
                sentTime: currentTime,
                name: name,
                msgContent: loremIpsum(
                    {random: true, avgSentencesPerParagraph: 2, avgWordsPerSentence: 6}
                ).join('\n'),
                msgType: 'text',
                avatarURL: avatar,
                msgId: (i * 1000 + x).toString()
            });
            currentTime += (30 + Math.random() * 2 * 60) * 1000; // Random delay from 30s to 2.5min
        }

        currentTime += (60 + Math.random() * 14 * 60) * 1000;
        i += carryOnConvItems;
    }

    return generatedConv;
}