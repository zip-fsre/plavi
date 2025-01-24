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
    }
}