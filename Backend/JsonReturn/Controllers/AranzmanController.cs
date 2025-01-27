// Controllers/AranzmanController.cs

using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using JsonReturn.Models;

namespace JsonReturn.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AranzmanController : ControllerBase
    {
        private readonly Pi02Context _context;
        public AranzmanController(Pi02Context context)
        {
            _context = context;
        }

        // GET: api/Aranzman
        [HttpGet]
        public ActionResult<IEnumerable<JsonReturn.Models.Aranzman>> GetAranzmen()
        {
            return _context.Aranzmen.ToList();
        }

        // GET: api/Aranzman/1
        [HttpGet("{id}")]
        public ActionResult<Aranzman> GetAranzman(int id)
        {
            var Aranzman = _context.Aranzmen.Find(id);
            if (Aranzman == null)
            {
                return NotFound();
            }
            return Aranzman;
        }

        // POST: api/Aranzman
        [HttpPost]
        public ActionResult<Aranzman> CreateAranzman(Aranzman Aranzman)
        {
            if (Aranzman == null)
            {
                return BadRequest();
            }

            _context.Aranzmen.Add(Aranzman);
            _context.SaveChanges();

            return CreatedAtAction(nameof(GetAranzman), new { id = Aranzman.Id }, Aranzman);
        }

        // POST: api/Aranzman/1
        [HttpPost("{id}")]
        public ActionResult<Aranzman> UpdateAranzman(int id, Aranzman Aranzman)
        {
            if (Aranzman == null)
            {
                return NotFound();
            }
            var arrays = _context.Aranzmen.ToList();
            if (arrays.SingleOrDefault(item => item.Id == id) == null)
            {
                return NotFound();
            }
            var array = arrays.SingleOrDefault(item => item.Id == id);
            if(Aranzman.Naziv != null)array.Naziv = Aranzman.Naziv;
            if(Aranzman.Cijena != null)array.Cijena = Aranzman.Cijena;
            if(Aranzman.Opis != null)array.Opis = Aranzman.Opis;
            _context.SaveChanges();
            return array;
        }

        // DELETE: api/Aranzman/1
        [HttpDelete("{id}")]
        public ActionResult<Aranzman> DeleteAranzman(int id)
        {
            var array = _context.Aranzmen.ToList();
            var pom = array.SingleOrDefault(item => item.Id == id);
            _context.Aranzmen.Remove(pom);
            _context.SaveChanges();
            return _context.Aranzmen.Find(id);
        }
    }
}