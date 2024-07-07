import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { findNotes, getAllNotes, newNote ,removeNote, removeAllNotes } from './notes.js'
import { listNotes } from './util.js'
import fs from 'node:fs/promises'
const DB_PATH = new URL('../db.json',import.meta.url).pathname

const insertDb  = async (note)=>{
    const db = JSON.parse(await fs.readFile(DB_PATH,'utf-8'));
    db.notes.push(note);
    // console.log('db',db);
    await fs.writeFile(DB_PATH, JSON.stringify(db,null,2));
}


yargs(hideBin(process.argv))
  .command('new <note>', 'Create a new note', (yargs) => {
    return yargs.positional('note',{
        type : 'string',
        description:'The content of the note to create'
    }) 
  }, async (argv) => {
    const tags =argv.tags? argv.tags.split(',') : []
    const note = await newNote(argv.note,tags);

    console.log('New note : ',note);
  })
  .option('tags',{
    alias:'t',
    type:'string',
    description:'tags to add to the note'
  })
  .command('all', 'get all notes', () => {} , async (argv) => {
    // console.info(argv);
    const notes = await getAllNotes();
    listNotes(notes);
  })
  .command('find <filter>', 'get matching notes', (yargs) => {
    return yargs.positional('filter',{
        type : 'string',
        description:'The content of the note to create'
    }) 
  },async (argv) => {
    // console.info(argv);
    const notes = await findNotes(argv.filter);
    listNotes(notes);
  })
  .command('remove <id>', 'remove a note by id', (yargs) => {
    return yargs.positional('id',{
        type : 'number',
        description:'The id of the node we want to remove'
    }) 
  }, async (argv) => {
    // console.info(argv);
    const id=await removeNote(argv.id);
    if(id){
        console.log('Note removed : ',id);
    }
    else{
        console.log('Note not found');
    }
  })
  .command('web [port]', 'launch website to see notes', (yargs) => {
    return yargs.positional('port',{
        type : 'number',
        description:'port to bind on',
        default:5000
    }) 
  }, (argv) => {
    console.info(argv);
  })
  .command('clean', 'remove all notes', () => {}, async (argv) => {
    // console.info(argv);
    await removeAllNotes();
    console.log('All Notes removed');
  })
  .demandCommand(1)
  .parse()
