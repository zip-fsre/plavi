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
    }
}