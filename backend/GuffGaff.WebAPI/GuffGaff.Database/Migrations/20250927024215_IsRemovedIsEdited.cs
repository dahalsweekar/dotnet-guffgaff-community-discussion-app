using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GuffGaff.Database.Migrations
{
    /// <inheritdoc />
    public partial class IsRemovedIsEdited : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsEdited",
                table: "Replies",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsRemoved",
                table: "Replies",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsEdited",
                table: "Posts",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsRemoved",
                table: "Posts",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsEdited",
                table: "Comments",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsRemoved",
                table: "Comments",
                type: "bit",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsEdited",
                table: "Replies");

            migrationBuilder.DropColumn(
                name: "IsRemoved",
                table: "Replies");

            migrationBuilder.DropColumn(
                name: "IsEdited",
                table: "Posts");

            migrationBuilder.DropColumn(
                name: "IsRemoved",
                table: "Posts");

            migrationBuilder.DropColumn(
                name: "IsEdited",
                table: "Comments");

            migrationBuilder.DropColumn(
                name: "IsRemoved",
                table: "Comments");
        }
    }
}
