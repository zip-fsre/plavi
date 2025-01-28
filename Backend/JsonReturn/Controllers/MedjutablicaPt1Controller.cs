// Controllers/MedjutablicaPt1Controller.cs

using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using JsonReturn.Models;

namespace JsonReturn.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MedjutablicaPt1Controller : ControllerBase
    {
        private readonly Pi02Context _context;
        public MedjutablicaPt1Controller(Pi02Context context)
        {
            _context = context;
        }

        // GET: api/MedjutablicaPt1
        [HttpGet]
        public ActionResult<IEnumerable<JsonReturn.Models.MedjutablicaPt1>> GetMedjutablicaPt1s()
        {
            return _context.MedjutablicaPt1s.ToList();
        }

        // GET: api/MedjutablicaPt1/1
        [HttpGet("{id}")]
        public ActionResult<MedjutablicaPt1> GetMedjutablicaPt1(int id)
        {
            var MedjutablicaPt1 = _context.MedjutablicaPt1s.Find(id);
            if (MedjutablicaPt1 == null)
            {
                return NotFound();
            }
            return MedjutablicaPt1;
        }

        // POST: api/MedjutablicaPt1
        [HttpPost]
        public ActionResult<MedjutablicaPt1> CreateMedjutablicaPt1(MedjutablicaPt1 MedjutablicaPt1)
        {
            if (MedjutablicaPt1 == null)
            {
                return BadRequest();
            }

            _context.MedjutablicaPt1s.Add(MedjutablicaPt1);
            _context.SaveChanges();

            return CreatedAtAction(nameof(GetMedjutablicaPt1), new { id = MedjutablicaPt1.Id }, MedjutablicaPt1);
        }

        // POST: api/MedjutablicaPt1/1
        [HttpPost("{id}")]
        public ActionResult<MedjutablicaPt1> UpdateMedjutablicaPt1(int id, MedjutablicaPt1 MedjutablicaPt1)
        {
            if (MedjutablicaPt1 == null)
            {
                return NotFound();
            }
            var arrays = _context.MedjutablicaPt1s.ToList();
            if (arrays.SingleOrDefault(item => item.Id == id) == null)
            {
                return NotFound();
            }
            var array = arrays.SingleOrDefault(item => item.Id == id);
            if(MedjutablicaPt1.IdPartnera != null)array.IdPartnera = MedjutablicaPt1.IdPartnera;
            if(MedjutablicaPt1.IdAranzmana != null)array.IdAranzmana = MedjutablicaPt1.IdAranzmana;
            if(MedjutablicaPt1.StatusPartnera != null)array.StatusPartnera = MedjutablicaPt1.StatusPartnera;
            if(MedjutablicaPt1.Izmjena != null)array.Izmjena = MedjutablicaPt1.Izmjena;
            if(MedjutablicaPt1.KonacnaCijena != null)array.KonacnaCijena = MedjutablicaPt1.KonacnaCijena;
            if(MedjutablicaPt1.DodatakNaProviziju != null)array.DodatakNaProviziju = MedjutablicaPt1.DodatakNaProviziju;
            _context.SaveChanges();
            return array;
        }

        // DELETE: api/MedjutablicaPt1/1
        [HttpDelete("{id}")]
        public ActionResult<MedjutablicaPt1> DeleteMedjutablicaPt1(int id)
        {
            var array = _context.MedjutablicaPt1s.ToList();
            var pom = array.SingleOrDefault(item => item.Id == id);
            _context.MedjutablicaPt1s.Remove(pom);
            _context.SaveChanges();
            return _context.MedjutablicaPt1s.Find(id);
        }

        // Get: api/MedjutablicaPt1/Partner/1
        [HttpGet("Partner/{id}")]
        public ActionResult<IEnumerable<JsonReturn.Models.MedjutablicaPt1>> GetPartner(int id)
        {
            return _context.MedjutablicaPt1s.AsQueryable().Where(Podatci => Podatci.IdPartnera == id).ToList();
        }
    }
}