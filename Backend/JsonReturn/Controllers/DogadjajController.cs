// Controllers/DogadjajController.cs

using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using JsonReturn.Models;

namespace JsonReturn.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DogadjajController : ControllerBase
    {
        private readonly Pi02Context _context;
        public DogadjajController(Pi02Context context)
        {
            _context = context;
        }

        // GET: api/Dogadjaj
        [HttpGet]
        public ActionResult<IEnumerable<JsonReturn.Models.Dogadjaj>> GetDogadjajs()
        {
            return _context.Dogadjajs.ToList();
        }

        // GET: api/Dogadjaj/1
        [HttpGet("{id}")]
        public ActionResult<Dogadjaj> GetDogadjaj(int id)
        {
            var Dogadjaj = _context.Dogadjajs.Find(id);
            if (Dogadjaj == null)
            {
                return NotFound();
            }
            return Dogadjaj;
        }

        // POST: api/Dogadjaj
        [HttpPost]
        public ActionResult<Dogadjaj> CreateDogadjaj(Dogadjaj Dogadjaj)
        {
            if (Dogadjaj == null)
            {
                return BadRequest();
            }

            _context.Dogadjajs.Add(Dogadjaj);
            _context.SaveChanges();

            return CreatedAtAction(nameof(GetDogadjaj), new { id = Dogadjaj.Id }, Dogadjaj);
        }
    }
}