using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GuffGaff.Database.Migrations
{
    /// <inheritdoc />
    public partial class Initialize1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "parentId",
                table: "Replies",
                newName: "ParentId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ParentId",
                table: "Replies",
                newName: "parentId");
        }
    }
}
