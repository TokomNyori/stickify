

// PART OF NOTE MODAL'S SUBMIT FUNCTION!!!

// if (isEdit) {
//     try {
//         setLoading(true)
//         const res = await editNoteHelper(
//             {
//                 method: 'PUT',
//                 headers: { 'Content-Type': 'application/json' },
//                 noteid: noteModalConfig.noteObject._id,
//                 body: isRephrasedNote ? rephrasedNote : note
//             }
//         )
//         const notesRes = await getNoteHelper({
//             method: 'GET',
//             userId: users._id,
//             headers: { 'Content-Type': 'application/json' }
//         })
//         console.log('notesRes.body')
//         console.log(notesRes.body)
//         dispatch(addNote(notesRes.body))
//         dispatch(addCurrentNotePage(res.body))
//         setLoading(false)
//         rephraseDefaultTrue()
//         toast("Boom! Note's Customized!", {
//             icon: '🔥📝'
//         });
//         closeModal(event)
//     } catch (error) {
//         console.log(error)
//         setLoading(false)
//         toast(`Could not edit!`, {
//             icon: '🥺'
//         });
//     }
//     return
// }
// try {
//     setLoading(true)
//     isRephrasedNote ?
//         await postNoteHelper({ method: 'POST', headers: { 'Content-Type': 'application/json' }, body: rephrasedNote })
//         :
//         await postNoteHelper({ method: 'POST', headers: { 'Content-Type': 'application/json' }, body: note })
//     const notesRes = await getNoteHelper({
//         method: 'GET',
//         userId: users._id,
//         headers: { 'Content-Type': 'application/json' }
//     })
//     dispatch(addNote(notesRes.body))
//     setLoading(false)
//     rephraseDefaultTrue()
//     toast("Boom! Note's Ready!", {
//         icon: '🔥📝'
//     });
//     closeModal(event)
// }