import { formatChatTime } from './date'

function test() {
    const now = new Date('2026-01-21T12:00:00')

    const tests = [
        {
            name: 'Just now',
            date: new Date('2026-01-21T11:59:30'),
            expected: 'just now'
        },
        {
            name: 'Same day HH:mm',
            date: new Date('2026-01-21T10:30:00'),
            expected: '10:30'
        },
        {
            name: 'Different day d Mmm',
            date: new Date('2026-01-20T10:30:00'),
            expected: '20 Jan'
        },
        {
            name: 'Different month',
            date: new Date('2025-12-10T10:30:00'),
            expected: '10 Dec'
        }
    ]

    console.log('--- Running Time Format Tests ---')
    tests.forEach(t => {
        const result = formatChatTime(t.date, now)
        const passed = result === t.expected
        console.log(`${passed ? '✅' : '❌'} ${t.name}: Expected "${t.expected}", got "${result}"`)
    })
}

test()
