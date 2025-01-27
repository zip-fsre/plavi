// Controllers/PartneriController.cs

using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using JsonReturn.Models;

namespace JsonReturn.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PartneriController : ControllerBase
    {
        private readonly Pi02Context _context;
        public PartneriController(Pi02Context context)
        {
            _context = context;
        }

        // GET: api/Partneri
        [HttpGet]
        public ActionResult<IEnumerable<JsonReturn.Models.Partneri>> GetPartneris()
        {
            return _context.Partneris.ToList();
        }

        // GET: api/Partneri/1
        [HttpGet("{id}")]
        public ActionResult<Partneri> GetPartneri(int id)
        {
            var Partneri = _context.Partneris.Find(id);
            if (Partneri == null)
            {
                return NotFound();
            }
            return Partneri;
        }

        // POST: api/Partneri
        [HttpPost]
        public ActionResult<Partneri> CreatePartneri(Partneri Partneri)
        {
            if (Partneri == null)
            {
                return BadRequest();
            }

            _context.Partneris.Add(Partneri);
            _context.SaveChanges();

            return CreatedAtAction(nameof(GetPartneri), new { id = Partneri.Id }, Partneri);
        }

        // POST: api/Partneri/1
        [HttpPost("{id}")]
        public ActionResult<Partneri> UpdatePartneri(int id, Partneri Partneri)
        {
            if (Partneri == null)
            {
                return NotFound();
            }
            var arrays = _context.Partneris.ToList();
            if (arrays.SingleOrDefault(item => item.Id == id) == null)
            {
                return NotFound();
            }
            var array = arrays.SingleOrDefault(item => item.Id == id);
            if(Partneri.Naziv != null)array.Naziv = Partneri.Naziv;
            if(Partneri.Tip != null)array.Tip = Partneri.Tip;
            if(Partneri.Napomena != null)array.Napomena = Partneri.Napomena;
            if(Partneri.Provizija != null)array.Provizija = Partneri.Provizija;
            _context.SaveChanges();
            return array;
        }

        // DELETE: api/Partneri/1
        [HttpDelete("{id}")]
        public ActionResult<Partneri> DeletePartneri(int id)
        {
            var array = _context.Partneris.ToList();
            var pom = array.SingleOrDefault(item => item.Id == id);
            _context.Partneris.Remove(pom);
            _context.SaveChanges();
            return _context.Partneris.Find(id);
        }
    }
}