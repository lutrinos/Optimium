import colors from 'colors/safe'

type Priority = 'info' | 'error'  | 'debug';

const colorCodes = {
    'info': 'green',
    'error': 'red',
    'debug': 'yellow'
}

export default (priority: Priority, title: string, message?: any) => {
    console.log(
        colors.white(`[${new Date().toLocaleTimeString('fr-FR')}]`),

        // @ts-expect-error
        colors[colorCodes[priority]](priority.toUpperCase()),
        colors.blue(title)
    );

    if (message) {
        console.group();
        console.log(colors.gray(message))
        console.groupEnd();
    }
}

